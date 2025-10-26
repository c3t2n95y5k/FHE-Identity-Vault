import { useReadContract, useWriteContract, usePublicClient, useAccount } from 'wagmi';
import { CONTRACTS, BALLOT_ABI } from '@/lib/contracts';
import { encryptUint32 } from '@/lib/fhe';
import { useState, useEffect } from 'react';

// Voting types matching contract enum
export enum VoteType {
  SingleChoice = 0,
  MultiChoice = 1,
  Weighted = 2,
  Quadratic = 3,
}

export enum VotingStatus {
  NotStarted = 0,
  Active = 1,
  Ended = 2,
  Tallied = 3,
}

// Hook to get voting count
export function useVotingCount() {
  const { data: count } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'votingCounter',
  });

  return { count: count ? Number(count) : 0 };
}

// Hook to get single voting details
export function useVotingDetails(votingId: number) {
  const { address } = useAccount();

  // Read voting config
  const { data: config, refetch: refetchConfig } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'votingConfigs',
    args: [BigInt(votingId)],
  });

  // Read voting status
  const { data: status, refetch: refetchStatus } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'getVotingStatus',
    args: [BigInt(votingId)],
  });

  // Read total voters
  const { data: totalVoters, refetch: refetchTotalVoters } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'totalVoters',
    args: [BigInt(votingId)],
  });

  // Read if user has voted
  const { data: hasVoted, refetch: refetchHasVoted } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'hasVoted',
    args: address ? [BigInt(votingId), address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const refetchAll = () => {
    refetchConfig();
    refetchStatus();
    refetchTotalVoters();
    refetchHasVoted();
  };

  return {
    config,
    status: status !== undefined ? Number(status) : undefined,
    totalVoters: totalVoters ? Number(totalVoters) : 0,
    hasVoted: !!hasVoted,
    refetchAll,
  };
}

export interface VotingOption {
  index: number;
  name: string;
  description: string;
  encryptedVoteCount: string;
  active: boolean;
}

// Hook to load voting options with metadata
export function useVotingOptions(votingId?: number) {
  const publicClient = usePublicClient();
  const [options, setOptions] = useState<VotingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = typeof votingId === 'number' && votingId >= 0;

  const { data: optionNames } = useReadContract({
    address: CONTRACTS.BALLOT,
    abi: BALLOT_ABI,
    functionName: 'getVotingOptions',
    args: enabled ? [BigInt(votingId!)] : undefined,
    query: {
      enabled,
    },
  });

  useEffect(() => {
    if (!enabled) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    if (!publicClient) {
      return;
    }

    if (!Array.isArray(optionNames)) {
      // When contract call hasn't resolved yet, keep loading spinner running
      if (optionNames === undefined) {
        setIsLoading(true);
      } else {
        setOptions([]);
        setIsLoading(false);
      }
      return;
    }

    let cancelled = false;
    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const names = optionNames as string[];
        const responses = await Promise.all(
          names.map((_, idx) =>
            publicClient.readContract({
              address: CONTRACTS.BALLOT,
              abi: BALLOT_ABI,
              functionName: 'votingOptions',
              args: [BigInt(votingId!), BigInt(idx)],
            })
          )
        );

        if (cancelled) return;

        const mapped: VotingOption[] = responses.map((option: any, idx) => {
          const [name, description, encryptedVoteCount, active] = option as [string, string, string, boolean];
          return {
            index: idx,
            name: name ?? (names[idx] ?? `Option ${idx + 1}`),
            description: description ?? '',
            encryptedVoteCount: encryptedVoteCount as string,
            active: Boolean(active),
          };
        });
        setOptions(mapped);
      } catch (err) {
        if (cancelled) return;
        setError(err as Error);
        setOptions([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [enabled, optionNames, publicClient, votingId]);

  return {
    options,
    isLoading,
    error,
  };
}

// Hook to create voting
export function useCreateVoting() {
  const { writeContractAsync } = useWriteContract();
  const [isCreating, setIsCreating] = useState(false);

  const createVoting = async (params: {
    name: string;
    description: string;
    voteType: VoteType;
    startTime: number;
    endTime: number;
    quorum: number;
    whitelistEnabled: boolean;
    maxVotersCount: number;
    optionNames: string[];
    optionDescriptions: string[];
  }) => {
    try {
      setIsCreating(true);

      // Create VotingConfig struct
      const config = {
        name: params.name,
        description: params.description,
        voteType: params.voteType,
        startTime: BigInt(params.startTime),
        endTime: BigInt(params.endTime),
        quorum: BigInt(params.quorum),
        whitelistEnabled: params.whitelistEnabled,
        maxVotersCount: BigInt(params.maxVotersCount),
      };

      const hash = await writeContractAsync({
        address: CONTRACTS.BALLOT,
        abi: BALLOT_ABI,
        functionName: 'createVoting',
        args: [config, params.optionNames, params.optionDescriptions],
      });

      return hash;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createVoting,
    isCreating,
  };
}

// Hook to cast vote with FHE encryption
export function useCastVote() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isVoting, setIsVoting] = useState(false);

  const castVote = async (votingId: number, optionIndex: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      setIsVoting(true);

      // Encrypt the vote option index using FHE
      const { handle: encryptedVote, inputProof: proof } = await encryptUint32(
        CONTRACTS.BALLOT,
        address,
        optionIndex
      );

      // Cast vote on-chain
      const hash = await writeContractAsync({
        address: CONTRACTS.BALLOT,
        abi: BALLOT_ABI,
        functionName: 'castVote',
        args: [BigInt(votingId), encryptedVote, proof],
      });

      return hash;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    castVote,
    isVoting,
  };
}

// Hook to get all votings (iterate through all voting IDs)
export function useAllVotings() {
  const { count } = useVotingCount();
  const [votings, setVotings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // We'll need to manually fetch each voting details
  // This is not optimal but necessary since there's no "getAll" function
  useEffect(() => {
    if (count === 0) {
      setIsLoading(false);
      return;
    }

    // For now, just return count so we know how many votings exist
    // The Voting page will need to fetch details for each one
    setIsLoading(false);
  }, [count]);

  return {
    count,
    isLoading,
  };
}
