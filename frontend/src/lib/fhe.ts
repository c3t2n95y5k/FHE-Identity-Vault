import { hexlify, getAddress } from 'ethers';

declare global {
  interface Window {
    relayerSDK?: {
      initSDK: () => Promise<void>;
      createInstance: (config: Record<string, unknown>) => Promise<any>;
      SepoliaConfig: Record<string, unknown>;
    };
    ethereum?: any;
    okxwallet?: any;
  }
}

// FHE instance singleton
let fhevmInstance: any = null;
let sdkPromise: Promise<any> | null = null;

const SDK_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js';

/**
 * Dynamically load Zama FHE SDK from CDN
 */
const loadSdk = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  if (window.relayerSDK) {
    return window.relayerSDK;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_URL}"]`) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(window.relayerSDK));
        existing.addEventListener('error', () => reject(new Error('Failed to load FHE SDK')));
        return;
      }

      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => {
        if (window.relayerSDK) {
          resolve(window.relayerSDK);
        } else {
          reject(new Error('relayerSDK unavailable after load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load FHE SDK'));
      document.body.appendChild(script);
    });
  }

  return sdkPromise;
};

/**
 * Initialize FHE SDK and create instance for Sepolia network
 */
export const initFHE = async (): Promise<any> => {
  // Return existing instance if already initialized
  if (fhevmInstance) return fhevmInstance;

  try {
    console.log('🔧 Loading FHE SDK...');

    // Load SDK from CDN
    const sdk = await loadSdk();
    if (!sdk) {
      throw new Error('FHE SDK not available');
    }

    // Initialize WASM module
    await sdk.initSDK();
    console.log('✅ WASM initialized');

    // Get Ethereum provider
    const ethereumProvider = window.okxwallet || window.ethereum;
    if (!ethereumProvider) {
      throw new Error('Ethereum provider not found. Please connect your wallet first.');
    }

    // Create FHE instance with Sepolia config
    const config = {
      ...sdk.SepoliaConfig,
      network: ethereumProvider,
    };

    fhevmInstance = await sdk.createInstance(config);
    console.log('✅ FHE instance created for Sepolia');

    return fhevmInstance;
  } catch (error) {
    console.error('❌ Failed to initialize FHE:', error);
    throw error;
  }
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
