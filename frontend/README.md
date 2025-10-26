# VeilCivic

VeilCivic delivers privacy-preserving identity management and encrypted voting powered by Zama's Fully Homomorphic Encryption (FHE).

## Overview

The platform combines encrypted identity (KYC) flows with privacy-first governance so communities can coordinate securely without exposing sensitive data.

### Key Features

- **🔒 Encrypted Identity Management**: Store and manage identity data with FHE encryption
- **🗳️ Privacy-Preserving Voting**: Single-choice, weighted, and quadratic voting with encrypted tallies
- **🎯 Access Control**: Identity-based access levels and whitelist management
- **⏰ Time-Gated Voting**: Automatic voting period enforcement
- **📊 Secure Results**: Encrypted vote counting with Gateway decryption

## Tech Stack

- **React 18** + TypeScript
- **Vite** - Build tool
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Zama FHE SDK** - Client-side encryption
- **wagmi** + **RainbowKit** - Web3 wallet integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fhe-vault-vote

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:8080

### Environment Variables

Create a `.env` file:

```env
VITE_IDENTITY_VAULT_ADDRESS=0x...
VITE_BALLOT_ADDRESS=0x...
VITE_QUADRATIC_VOTING_ADDRESS=0x...
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Build

```bash
# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Page components
└── types/          # TypeScript types
```

## Features

### Identity Management
- Create encrypted identity with net worth
- Update identity data
- View access level (Basic/Full/Premium)
- Client-side decryption of sensitive data

### Voting System
- **Single Choice**: Traditional one-person-one-vote
- **Weighted Voting**: Token-based voting power
- **Quadratic Voting**: Democratic credit allocation

### Admin Features
- Create voting polls
- Manage whitelists
- Configure voting parameters

## License

MIT License
