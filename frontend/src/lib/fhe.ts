import { hexlify, getAddress } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
    fhevm?: any;
  }
}

// FHE instance singleton
let fhevmInstance: any = null;
let initPromise: Promise<any> | null = null;

// Sepolia network configuration
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  networkUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  aclAddress: '0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5',
};

/**
 * Initialize FHE SDK and create instance for Sepolia network
 */
export const initFHE = async (): Promise<any> => {
  // Return existing instance if already initialized
  if (fhevmInstance) return fhevmInstance;

  // Return pending initialization if in progress
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log('🔧 Initializing FHE SDK...');

      // Get Ethereum provider
      const ethereumProvider = window.okxwallet || window.ethereum;
      if (!ethereumProvider) {
        throw new Error('Ethereum provider not found. Please connect your wallet first.');
      }

      // Dynamic import from CDN
      const { createInstance } = await import(
        'https://cdn.jsdelivr.net/npm/fhevmjs@0.5.3/+esm'
      );

      // Create FHE instance with Sepolia config
      fhevmInstance = await createInstance({
        chainId: SEPOLIA_CONFIG.chainId,
        networkUrl: SEPOLIA_CONFIG.networkUrl,
        gatewayUrl: SEPOLIA_CONFIG.gatewayUrl,
        aclAddress: SEPOLIA_CONFIG.aclAddress,
        network: ethereumProvider,
      });

      console.log('✅ FHE instance created for Sepolia');

      return fhevmInstance;
    } catch (error) {
      console.error('❌ Failed to initialize FHE:', error);
      initPromise = null; // Reset so it can retry
      throw error;
    }
  })();

  return initPromise;
};

/**
 * Get current FHE instance (must call initFHE first)
 */
export const getFHEInstance = (): any | null => {
  return fhevmInstance;
};

/**
 * Encrypt a uint64 value (for Identity netWorth)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param value Value to encrypt (as bigint)
 * @returns Encrypted handle and proof
 */
export const encryptUint64 = async (
  contractAddress: string,
  userAddress: string,
  value: bigint
): Promise<{ handle: string; inputProof: string }> => {
  const instance = await initFHE();

  // Checksum addresses to prevent errors
  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  // Create encrypted input
  const input = instance.createEncryptedInput(contractAddr, userAddr);
  input.add64(Number(value)); // Convert bigint to number for add64

  // Encrypt and get handles
  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    inputProof: hexlify(inputProof),
  };
};

/**
 * Encrypt a uint32 value (for Voting options)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param value Value to encrypt (as number)
 * @returns Encrypted handle and proof
 */
export const encryptUint32 = async (
  contractAddress: string,
  userAddress: string,
  value: number
): Promise<{ handle: string; inputProof: string }> => {
  const instance = await initFHE();

  // Checksum addresses to prevent errors
  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  // Create encrypted input
  const input = instance.createEncryptedInput(contractAddr, userAddr);
  input.add32(value); // Use add32 for euint32

  // Encrypt and get handles
  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    inputProof: hexlify(inputProof),
  };
};

/**
 * Encrypt multiple uint32 values (for Quadratic Voting)
 * @param contractAddress Contract address (will be checksummed)
 * @param userAddress User wallet address (will be checksummed)
 * @param values Array of values to encrypt
 * @returns Array of encrypted handles and single proof
 */
export const encryptUint32Array = async (
  contractAddress: string,
  userAddress: string,
  values: number[]
): Promise<{ handles: string[]; inputProof: string }> => {
  const instance = await initFHE();

  // Checksum addresses to prevent errors
  const contractAddr = getAddress(contractAddress);
  const userAddr = getAddress(userAddress);

  // Create encrypted input
  const input = instance.createEncryptedInput(contractAddr, userAddr);

  // Add all values
  values.forEach(value => {
    input.add32(value);
  });

  // Encrypt and get handles
  const { handles, inputProof } = await input.encrypt();

  return {
    handles: handles.map((h: any) => hexlify(h)),
    inputProof: hexlify(inputProof),
  };
};

/**
 * Decrypt an encrypted uint64 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @returns Decrypted value as bigint
 */
export const decryptUint64 = async (
  handle: string,
  contractAddress: string,
  userAddress: string
): Promise<bigint> => {
  const instance = await initFHE();

  try {
    // ✅ Checksum addresses
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    // Reencrypt for the user
    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return BigInt(reencrypted);
  } catch (error) {
    console.error('Failed to decrypt uint64:', error);
    throw error;
  }
};

/**
 * Decrypt an encrypted uint32 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @returns Decrypted value as number
 */
export const decryptUint32 = async (
  handle: string,
  contractAddress: string,
  userAddress: string
): Promise<number> => {
  const instance = await initFHE();

  try {
    // ✅ Checksum addresses
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    // Reencrypt for the user
    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return Number(reencrypted);
  } catch (error) {
    console.error('Failed to decrypt uint32:', error);
    throw error;
  }
};

/**
 * Decrypt an encrypted uint8 value
 * @param handle Encrypted handle from contract
 * @param contractAddress Contract address
 * @param userAddress User wallet address
 * @returns Decrypted value as number
 */
export const decryptUint8 = async (
  handle: string,
  contractAddress: string,
  userAddress: string
): Promise<number> => {
  const instance = await initFHE();

  try {
    // ✅ Checksum addresses
    const contractAddr = getAddress(contractAddress);
    const userAddr = getAddress(userAddress);

    // Reencrypt for the user
    const reencrypted = await instance.reencrypt(
      handle,
      contractAddr,
      userAddr
    );

    return Number(reencrypted);
  } catch (error) {
    console.error('Failed to decrypt uint8:', error);
    throw error;
  }
};

/**
 * Format encrypted handle for display
 * @param handle Encrypted handle string
 * @returns Truncated display string
 */
export const formatEncryptedHandle = (handle: string): string => {
  if (!handle) return 'N/A';
  return `${handle.slice(0, 6)}...${handle.slice(-4)}`;
};

/**
 * Validate if value fits in uint64 (max: 18,446,744,073,709,551,615)
 * @param value Value to check
 * @returns Boolean indicating if valid
 */
export const isValidUint64 = (value: bigint): boolean => {
  const MAX_UINT64 = BigInt('18446744073709551615');
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
 * @returns Encrypted amount and proof
 */
export const encryptData = async (
  value: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{ encryptedAmount: string; proof: string }> => {
  const result = await encryptUint64(contractAddress, userAddress, value);
  return {
    encryptedAmount: result.handle,
    proof: result.inputProof,
  };
};
