import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { encryptData, initFHE } from '@/lib/fhe';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export function useIdentity() {
  const { address } = useAccount();

  // Read: Check if user has identity
  const { data: hasIdentity, refetch: refetchHasIdentity } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: ABIS.IDENTITY_VAULT.abi,
    functionName: 'hasIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read: Get identity (only public fields will be visible)
  const { data: identityData } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: ABIS.IDENTITY_VAULT.abi,
    functionName: 'getIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasIdentity,
    },
  });

  return {
    hasIdentity: !!hasIdentity,
    identityData,
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
    isPEP: boolean;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      setIsEncrypting(true);

      // Initialize FHE
      await initFHE();

      // Encrypt net worth
      const { encryptedAmount: encryptedNetWorth, proof: netWorthProof } = await encryptData(
        BigInt(params.netWorth),
        CONTRACTS.IDENTITY_VAULT,
        address
      );

      setIsEncrypting(false);

      // Create identity on-chain
      const hash = await writeContractAsync({
        address: CONTRACTS.IDENTITY_VAULT,
        abi: ABIS.IDENTITY_VAULT.abi,
        functionName: 'createIdentity',
        args: [
          encryptedNetWorth,
          netWorthProof,
          params.domicile,
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

      // Initialize FHE
      await initFHE();

      // Encrypt net worth
      const { encryptedAmount: encryptedNetWorth, proof: netWorthProof } = await encryptData(
        BigInt(params.netWorth),
        CONTRACTS.IDENTITY_VAULT,
        address
      );

      setIsEncrypting(false);

      // Update identity on-chain
      const hash = await writeContractAsync({
        address: CONTRACTS.IDENTITY_VAULT,
        abi: ABIS.IDENTITY_VAULT.abi,
        functionName: 'updateIdentity',
        args: [
          encryptedNetWorth,
          netWorthProof,
          params.domicile,
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
