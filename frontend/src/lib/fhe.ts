import { bytesToHex, getAddress } from "viem";
import type { Address } from "viem";

/**
 * FHE SDK Integration for FHE-Identity-Vault
 * Updated for fhEVM 0.9.1 with @zama-fhe/relayer-sdk 0.3.0-5
 *
 * This module provides client-side encryption for:
 * - Identity netWorth (euint64)
 * - Voting choices (euint32)
 * - Quadratic voting allocations (euint32[])
 */

declare global {
  interface Window {
    RelayerSDK?: any;
    relayerSDK?: any;
    ethereum?: any;
    okxwallet?: any;
  }
}

// FHE instance singleton
let fheInstance: any = null;

/**
 * Get the Relayer SDK from window
 */
const getSDK = () => {
  if (typeof window === "undefined") {
    throw new Error("FHE SDK requires a browser environment");
  }
  const sdk = window.RelayerSDK || window.relayerSDK;
  if (!sdk) {
    throw new Error("Relayer SDK not loaded. Ensure the CDN script tag is present.");
  }
  return sdk;
};

/**
 * Initialize FHE SDK and create instance for Sepolia network
 * @param provider - Optional ethereum provider
 */
export const initializeFHE = async (provider?: any): Promise<any> => {
  if (fheInstance) return fheInstance;

  if (typeof window === "undefined") {
    throw new Error("FHE SDK requires a browser environment");
  }

  const ethereumProvider =
    provider || window.ethereum || window.okxwallet?.provider || window.okxwallet;

  if (!ethereumProvider) {
    throw new Error("No wallet provider detected. Connect a wallet first.");
  }

  console.log("[FHE] Initializing SDK...");
  const sdk = getSDK();
  const { initSDK, createInstance, SepoliaConfig } = sdk;
  await initSDK();
  const config = { ...SepoliaConfig, network: ethereumProvider };
  fheInstance = await createInstance(config);
  console.log("[FHE] SDK initialized successfully");
  return fheInstance;
};

// Alias for backwards compatibility
export const initFHE = initializeFHE;

/**
 * Get FHE instance (initializes if needed)
 */
const getInstance = async (provider?: any) => {
  if (fheInstance) return fheInstance;
  return initializeFHE(provider);
};

/**
 * Get current FHE instance (must call initializeFHE first)
 */
export const getFHEInstance = (): any | null => {
  return fheInstance;
};

/**
 * Check if FHE SDK is loaded and ready
 */
export const isFHEReady = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window.RelayerSDK || window.relayerSDK);
};

// Alias for compatibility
export const isFheReady = (): boolean => {
  return fheInstance !== null;
};

export const isSDKLoaded = isFHEReady;

/**
 * Wait for FHE SDK to be loaded (with timeout)
 * @param timeoutMs - Timeout in milliseconds
 */
export const waitForFHE = async (timeoutMs: number = 10000): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (isFHEReady()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return false;
};

/**
 * Encrypt a uint64 value (for Identity netWorth)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param value Value to encrypt (as bigint)
 * @param provider Optional ethereum provider
 * @returns Encrypted handle and proof
 */
export const encryptUint64 = async (
  contractAddress: string,
  userAddress: string,
  value: bigint,
  provider?: any
): Promise<{ handle: `0x${string}`; inputProof: `0x${string}` }> => {
  const instance = await getInstance(provider);

  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  console.log("[FHE] Encrypting uint64:", { value: value.toString() });
  console.log("[FHE] Creating encrypted input for:", {
    contract: contractAddr,
    user: userAddr,
  });

  const input = instance.createEncryptedInput(contractAddr, userAddr);
  input.add64(value);

  console.log("[FHE] Encrypting input...");
  const { handles, inputProof } = await input.encrypt();
  console.log("[FHE] Encryption complete, handles:", handles.length);

  if (!handles?.length || !inputProof) {
    throw new Error("FHE encryption failed: empty handles or proof");
  }

  return {
    handle: bytesToHex(handles[0]) as `0x${string}`,
    inputProof: bytesToHex(inputProof) as `0x${string}`,
  };
};

/**
 * Encrypt a uint32 value (for Voting options)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param value Value to encrypt (as number)
 * @param provider Optional ethereum provider
 * @returns Encrypted handle and proof
 */
export const encryptUint32 = async (
  contractAddress: string,
  userAddress: string,
  value: number,
  provider?: any
): Promise<{ handle: `0x${string}`; inputProof: `0x${string}` }> => {
  const instance = await getInstance(provider);

  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  console.log("[FHE] Encrypting uint32:", { value });
  console.log("[FHE] Creating encrypted input for:", {
    contract: contractAddr,
    user: userAddr,
  });

  const input = instance.createEncryptedInput(contractAddr, userAddr);
  input.add32(value);

  console.log("[FHE] Encrypting input...");
  const { handles, inputProof } = await input.encrypt();
  console.log("[FHE] Encryption complete, handles:", handles.length);

  if (!handles?.length || !inputProof) {
    throw new Error("FHE encryption failed: empty handles or proof");
  }

  return {
    handle: bytesToHex(handles[0]) as `0x${string}`,
    inputProof: bytesToHex(inputProof) as `0x${string}`,
  };
};

/**
 * Encrypt multiple uint32 values (for Quadratic Voting)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param values Array of values to encrypt
 * @param provider Optional ethereum provider
 * @returns Array of encrypted handles and single proof
 */
export const encryptUint32Array = async (
  contractAddress: string,
  userAddress: string,
  values: number[],
  provider?: any
): Promise<{ handles: `0x${string}`[]; inputProof: `0x${string}` }> => {
  const instance = await getInstance(provider);

  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  console.log("[FHE] Encrypting uint32 array:", { count: values.length });

  const input = instance.createEncryptedInput(contractAddr, userAddr);
  values.forEach(value => {
    input.add32(value);
  });

  console.log("[FHE] Encrypting input...");
  const { handles, inputProof } = await input.encrypt();
  console.log("[FHE] Encryption complete, handles:", handles.length);

  if (!handles?.length || !inputProof) {
    throw new Error("FHE encryption failed: empty handles or proof");
  }

  return {
    handles: handles.map((h: any) => bytesToHex(h) as `0x${string}`),
    inputProof: bytesToHex(inputProof) as `0x${string}`,
  };
};

/**
 * Decrypt an encrypted uint64 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @param provider Optional ethereum provider
 * @returns Decrypted value as bigint
 */
export const decryptUint64 = async (
  handle: string,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<bigint> => {
  const instance = await getInstance(provider);

  try {
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return BigInt(reencrypted);
  } catch (error) {
    console.error("[FHE] Failed to decrypt uint64:", error);
    throw error;
  }
};

/**
 * Decrypt an encrypted uint32 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @param provider Optional ethereum provider
 * @returns Decrypted value as number
 */
export const decryptUint32 = async (
  handle: string,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<number> => {
  const instance = await getInstance(provider);

  try {
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return Number(reencrypted);
  } catch (error) {
    console.error("[FHE] Failed to decrypt uint32:", error);
    throw error;
  }
};

/**
 * Decrypt an encrypted uint8 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @param provider Optional ethereum provider
 * @returns Decrypted value as number
 */
export const decryptUint8 = async (
  handle: string,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<number> => {
  const instance = await getInstance(provider);

  try {
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return Number(reencrypted);
  } catch (error) {
    console.error("[FHE] Failed to decrypt uint8:", error);
    throw error;
  }
};

/**
 * Format encrypted handle for display
 * @param handle Encrypted handle string
 * @returns Truncated display string
 */
export const formatEncryptedHandle = (handle: string): string => {
  if (!handle) return "N/A";
  return `${handle.slice(0, 6)}...${handle.slice(-4)}`;
};

/**
 * Validate if value fits in uint64 (max: 18,446,744,073,709,551,615)
 * @param value Value to check
 * @returns Boolean indicating if valid
 */
export const isValidUint64 = (value: bigint): boolean => {
  const MAX_UINT64 = BigInt("18446744073709551615");
  return value >= 0n && value <= MAX_UINT64;
};

/**
 * Validate if value fits in uint32 (max: 4,294,967,295)
 * @param value Value to check
 * @returns Boolean indicating if valid
 */
export const isValidUint32 = (value: number): boolean => {
  return value >= 0 && value <= 4294967295;
};

/**
 * Generic encrypt data function (alias for encryptUint64)
 * @param value Value to encrypt (as bigint)
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @param provider Optional ethereum provider
 * @returns Encrypted amount and proof
 */
export const encryptData = async (
  value: bigint,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{ encryptedAmount: `0x${string}`; proof: `0x${string}` }> => {
  const result = await encryptUint64(contractAddress, userAddress, value, provider);
  return {
    encryptedAmount: result.handle,
    proof: result.inputProof,
  };
};

/**
 * Encrypt identity data for FHEIdentityVault
 * @param contractAddress FHEIdentityVault contract address
 * @param userAddress User wallet address
 * @param netWorth Net worth value to encrypt
 * @param provider Optional ethereum provider
 * @returns Encrypted handle and proof
 */
export const encryptIdentityData = async (
  contractAddress: string,
  userAddress: string,
  netWorth: bigint,
  provider?: any
): Promise<{ encryptedNetWorth: `0x${string}`; proof: `0x${string}` }> => {
  const result = await encryptUint64(contractAddress, userAddress, netWorth, provider);
  return {
    encryptedNetWorth: result.handle,
    proof: result.inputProof,
  };
};

/**
 * Encrypt vote choice for FHEBallot
 * @param contractAddress FHEBallot contract address
 * @param userAddress User wallet address
 * @param choice Vote choice (option index)
 * @param provider Optional ethereum provider
 * @returns Encrypted handle and proof
 */
export const encryptVoteChoice = async (
  contractAddress: string,
  userAddress: string,
  choice: number,
  provider?: any
): Promise<{ encryptedVote: `0x${string}`; proof: `0x${string}` }> => {
  const result = await encryptUint32(contractAddress, userAddress, choice, provider);
  return {
    encryptedVote: result.handle,
    proof: result.inputProof,
  };
};

/**
 * Encrypt quadratic voting allocations
 * @param contractAddress FHEQuadraticVoting contract address
 * @param userAddress User wallet address
 * @param allocations Array of vote allocations per option
 * @param provider Optional ethereum provider
 * @returns Array of encrypted handles and proof
 */
export const encryptQuadraticVotes = async (
  contractAddress: string,
  userAddress: string,
  allocations: number[],
  provider?: any
): Promise<{ encryptedVotes: `0x${string}`[]; proof: `0x${string}` }> => {
  const result = await encryptUint32Array(contractAddress, userAddress, allocations, provider);
  return {
    encryptedVotes: result.handles,
    proof: result.inputProof,
  };
};

/**
 * Get FHE status for debugging
 */
export const getFHEStatus = (): {
  sdkLoaded: boolean;
  instanceReady: boolean;
} => {
  return {
    sdkLoaded: isFHEReady(),
    instanceReady: fheInstance !== null,
  };
};
