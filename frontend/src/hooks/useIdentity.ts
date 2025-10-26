import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS, IDENTITY_VAULT_ABI } from '@/lib/contracts';
import { encryptData } from '@/lib/fhe';
import { useAccount } from 'wagmi';
import { useMemo, useState } from 'react';
import { countryCodeToNumeric } from '@/lib/countries';

export function useIdentity() {
  const { address } = useAccount();

  // Read: Check if user has identity
  const {
    data: hasIdentityData,
    refetch: refetchHasIdentity,
    status: hasIdentityStatus,
  } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: IDENTITY_VAULT_ABI,
    functionName: 'hasIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read: Get identity plaintext data (domicile, tier, etc.)
  const {
    data: identityPlaintext,
    status: identityStatus,
  } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: IDENTITY_VAULT_ABI,
    functionName: 'getPlaintextData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && Boolean(hasIdentityData),
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

  return {
    hasIdentity: Boolean(hasIdentityData),
    identity,
    identityData: identity,
    isLoading: hasIdentityStatus === 'pending' || identityStatus === 'pending',
    refetchHasIdentity,
  };
}

export function useCreateIdentity() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isEncrypting, setIsEncrypting] = useState(false);

  const createIdentity = async (params: {
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

      const hash = await writeContractAsync({
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

      return hash;
    } catch (error) {
      setIsEncrypting(false);
      throw error;
    }
  };

  return {
    createIdentity,
    isEncrypting,
  };
}

export function useUpdateIdentity() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isEncrypting, setIsEncrypting] = useState(false);

  const updateIdentity = async (params: {
    netWorth: number;
    domicile: string;
    isPEP: boolean;
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
      const hash = await writeContractAsync({
        address: CONTRACTS.IDENTITY_VAULT,
        abi: IDENTITY_VAULT_ABI,
        functionName: 'updateIdentity',
        args: [
          encryptedNetWorth,
          netWorthProof,
          countryCodeToNumeric(params.domicile),
          params.isPEP,
        ],
      });

      return hash;
    } catch (error) {
      setIsEncrypting(false);
      throw error;
    }
  };

  return {
    updateIdentity,
    isEncrypting,
  };
}
