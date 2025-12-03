import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, IDENTITY_VAULT_ABI } from '@/lib/contracts';
import { encryptData } from '@/lib/fhe';
import { useAccount } from 'wagmi';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { countryCodeToNumeric } from '@/lib/countries';
import {
  toastTxPending,
  toastTxSuccess,
  toastTxError,
  toastUserRejected,
  isUserRejectedError,
} from '@/lib/toast-utils';

export function useIdentity() {
  const { address, isConnected } = useAccount();

  // Read: Check if user has identity
  const {
    data: hasIdentityData,
    refetch: refetchHasIdentity,
    isLoading: hasIdentityLoading,
    isFetching: hasIdentityFetching,
  } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: IDENTITY_VAULT_ABI,
    functionName: 'hasIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Read: Get identity plaintext data (domicile, tier, etc.)
  const {
    data: identityPlaintext,
    isLoading: identityLoading,
    isFetching: identityFetching,
  } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: IDENTITY_VAULT_ABI,
    functionName: 'getPlaintextData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected && Boolean(hasIdentityData),
    },
  });

  const identity = useMemo(() => {
    if (!identityPlaintext) return null;

    const [
      domicile,
      tier,
      pep,
      watchlist,
      riskScore,
      createdAt,
      updatedAt,
    ] = identityPlaintext as readonly [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint
    ];

    return {
      domicileCode: Number(domicile),
      tier: Number(tier),
      pep: Number(pep) === 1,
      watchlist: Number(watchlist),
      riskScore: Number(riskScore),
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }, [identityPlaintext]);

  // Only show loading when wallet is connected and queries are actually fetching
  const isLoading = isConnected && (hasIdentityLoading || hasIdentityFetching ||
    (Boolean(hasIdentityData) && (identityLoading || identityFetching)));

  return {
    hasIdentity: Boolean(hasIdentityData),
    identity,
    identityData: identity,
    isLoading,
    isConnected,
    refetchHasIdentity,
  };
}

export function useCreateIdentity() {
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Show pending toast when transaction is submitted
  useEffect(() => {
    if (hash && isPending) {
      toastTxPending(hash);
    }
  }, [hash, isPending]);

  // Show success toast when transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash) {
      toastTxSuccess(hash, "Identity created successfully!");
    }
  }, [isSuccess, hash]);

  // Show error toast for confirmation errors
  useEffect(() => {
    if (confirmError && hash) {
      toastTxError(hash, confirmError);
    }
  }, [confirmError, hash]);

  // Show error toast for write errors
  useEffect(() => {
    if (error) {
      if (isUserRejectedError(error)) {
        toastUserRejected();
      } else {
        toastTxError(hash, error);
      }
    }
  }, [error, hash]);

  const createIdentity = useCallback(async (params: {
    netWorth: number;
    domicile: string;
    tier: number;
    isPEP: boolean;
    watchlist: number;
    riskScore: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      setIsEncrypting(true);

      // Encrypt net worth (initFHE will be called inside encryptData)
      const { encryptedAmount: encryptedNetWorth, proof: netWorthProof } = await encryptData(
        BigInt(params.netWorth),
        CONTRACTS.IDENTITY_VAULT,
        address
      );

      setIsEncrypting(false);

      // Create identity on-chain
      // Contract expects: (encryptedNetWorth, proof, domicile, tier, pep, watchlist, riskScore)
      const domicileCode = countryCodeToNumeric(params.domicile);
      const pep = params.isPEP ? 1 : 0;

      const txHash = await writeContractAsync({
        address: CONTRACTS.IDENTITY_VAULT,
        abi: IDENTITY_VAULT_ABI,
        functionName: 'createIdentity',
        args: [
          encryptedNetWorth,
          netWorthProof,
          domicileCode,
          params.tier,
          pep,
          params.watchlist,
          params.riskScore,
        ],
      });

      return txHash;
    } catch (err) {
      setIsEncrypting(false);
      throw err;
    }
  }, [address, writeContractAsync]);

  return {
    createIdentity,
    isEncrypting,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || confirmError,
    reset,
  };
}

export function useUpdateIdentity() {
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Show pending toast when transaction is submitted
  useEffect(() => {
    if (hash && isPending) {
      toastTxPending(hash);
    }
  }, [hash, isPending]);

  // Show success toast when transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash) {
      toastTxSuccess(hash, "Identity updated successfully!");
    }
  }, [isSuccess, hash]);

  // Show error toast for confirmation errors
  useEffect(() => {
    if (confirmError && hash) {
      toastTxError(hash, confirmError);
    }
  }, [confirmError, hash]);

  // Show error toast for write errors
  useEffect(() => {
    if (error) {
      if (isUserRejectedError(error)) {
        toastUserRejected();
      } else {
        toastTxError(hash, error);
      }
    }
  }, [error, hash]);

  const updateIdentity = useCallback(async (params: {
    netWorth: number;
    domicile: string;
    tier: number;
    isPEP: boolean;
    watchlist: number;
    riskScore: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      setIsEncrypting(true);

      // Encrypt net worth (initFHE will be called inside encryptData)
      const { encryptedAmount: encryptedNetWorth, proof: netWorthProof } = await encryptData(
        BigInt(params.netWorth),
        CONTRACTS.IDENTITY_VAULT,
        address
      );

      setIsEncrypting(false);

      // Update identity on-chain
      const txHash = await writeContractAsync({
        address: CONTRACTS.IDENTITY_VAULT,
        abi: IDENTITY_VAULT_ABI,
        functionName: 'updateIdentity',
        args: [
          encryptedNetWorth,
          netWorthProof,
          countryCodeToNumeric(params.domicile),
          params.tier,
          params.isPEP ? 1 : 0,
          params.watchlist,
          params.riskScore,
        ],
      });

      return txHash;
    } catch (err) {
      setIsEncrypting(false);
      throw err;
    }
  }, [address, writeContractAsync]);

  return {
    updateIdentity,
    isEncrypting,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: error || confirmError,
    reset,
  };
}
