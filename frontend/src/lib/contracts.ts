// Contract addresses (will be populated from environment variables)
export const CONTRACTS = {
  IDENTITY_VAULT: (import.meta.env.VITE_IDENTITY_VAULT_ADDRESS || '') as `0x${string}`,
  BALLOT: (import.meta.env.VITE_BALLOT_ADDRESS || '') as `0x${string}`,
  QUADRATIC_VOTING: (import.meta.env.VITE_QUADRATIC_VOTING_ADDRESS || '') as `0x${string}`,
} as const;

// Import contract ABIs
import IdentityVaultABI from '../contracts/FHEIdentityVault.json';
import BallotABI from '../contracts/FHEBallot.json';
import QuadraticVotingABI from '../contracts/FHEQuadraticVoting.json';

export const ABIS = {
  IDENTITY_VAULT: IdentityVaultABI,
  BALLOT: BallotABI,
  QUADRATIC_VOTING: QuadraticVotingABI,
} as const;

// Chain configuration
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11155111;
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://gateway.sepolia.zama.ai';
