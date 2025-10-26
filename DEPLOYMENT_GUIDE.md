# FHE Identity & Voting Platform - Deployment Guide

Complete guide for deploying and configuring the FHE Identity & Voting Platform on Sepolia testnet.

---

## 📋 Prerequisites

Before deploying, ensure you have:

### 1. **Development Environment**
- ✅ Node.js 18+ and npm
- ✅ Git
- ✅ Code editor (VS Code recommended)

### 2. **Blockchain Wallet**
- ✅ MetaMask installed
- ✅ Sepolia testnet ETH (at least 0.1 ETH)
  - Get from: https://sepoliafaucet.com
  - Alternative: https://faucet.sepolia.dev

### 3. **API Keys (Optional)**
- Etherscan API key for contract verification: https://etherscan.io/myapikey
- WalletConnect Project ID: https://cloud.walletconnect.com/

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Navigate to project
cd /Users/songsu/Desktop/zama/FHE-Identity-Vault

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Contracts

```bash
cd ../contracts

# The .env file is already configured with a test key
# Check if you have Sepolia ETH
node scripts/check-env.js
```

**Expected output:**
```
✅ ENVIRONMENT CHECK PASSED
🚀 Ready to deploy!
```

### Step 3: Deploy Contracts

```bash
# Deploy all three contracts
npx hardhat run scripts/deploy-all.js --network sepolia
```

**This will deploy:**
1. ✅ FHEIdentityVault
2. ✅ FHEBallot
3. ✅ FHEQuadraticVoting

**Deployment takes ~2-3 minutes**

### Step 4: Start Frontend

```bash
cd ../frontend

# The .env file is auto-generated with contract addresses
npm run dev
```

**Frontend runs on:** http://localhost:8080

### Step 5: Connect Wallet

1. Open http://localhost:8080
2. Click "Connect Wallet" button
3. Select MetaMask
4. Switch to **Sepolia** network
5. Approve connection

🎉 **Done! You can now create identities and vote!**

---

## 📝 Detailed Deployment Steps

### 1. Environment Configuration

#### Contracts (.env)

The contracts `.env` is already configured with a test private key. To use your own:

```bash
cd contracts
nano .env  # or use your preferred editor
```

Update:
```env
# Replace with YOUR private key (get from MetaMask)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Optional: Add for contract verification
ETHERSCAN_API_KEY=YOUR_API_KEY_HERE
```

**⚠️ Security Warning:**
- Use a dedicated deployment wallet
- Never commit real private keys to git
- Keep only small amounts of ETH in deployment wallet

#### Frontend (.env)

Frontend `.env` is **automatically generated** during deployment. You can manually create it:

```bash
cd frontend
cp .env.example .env
nano .env
```

Update with deployed contract addresses:
```env
VITE_IDENTITY_VAULT_ADDRESS=0x...
VITE_BALLOT_ADDRESS=0x...
VITE_QUADRATIC_VOTING_ADDRESS=0x...
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai
VITE_WALLETCONNECT_PROJECT_ID=your_project_id  # Optional
```

### 2. Pre-Deployment Check

Run the environment check script:

```bash
cd contracts
node scripts/check-env.js
```

This validates:
- ✅ `.env` file exists
- ✅ `PRIVATE_KEY` is valid
- ✅ RPC connection works
- ✅ Deployer has sufficient ETH
- ✅ Contract files exist

**Fix any errors before deploying!**

### 3. Contract Compilation

```bash
cd contracts
npm run compile
```

**Expected output:**
```
Compiled 5 Solidity files successfully
```

**If compilation fails:**
- Check Node.js version: `node --version` (must be 18+)
- Clear cache: `npx hardhat clean`
- Reinstall: `rm -rf node_modules && npm install`

### 4. Contract Deployment

#### Option A: Deploy All Contracts (Recommended)

```bash
npx hardhat run scripts/deploy-all.js --network sepolia
```

**What this does:**
1. Deploys FHEIdentityVault
2. Deploys FHEBallot
3. Deploys FHEQuadraticVoting
4. Saves deployment info to `deployments/`
5. Auto-generates `frontend/.env`

#### Option B: Deploy Individual Contracts

```bash
# Deploy only Identity Vault
npx hardhat run scripts/deploy-identity.js --network sepolia

# Deploy only Voting contracts
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### 5. Verify Deployment

After deployment, verify contracts on Etherscan:

```bash
# Verify all contracts (requires ETHERSCAN_API_KEY in .env)
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

**Example:**
```bash
npx hardhat verify --network sepolia 0x1234...5678
```

### 6. Frontend Setup

```bash
cd frontend

# Check .env was created
cat .env

# Install dependencies if not done
npm install

# Start development server
npm run dev
```

**Frontend features:**
- 🏠 Home page with platform overview
- 🆔 Identity management page
- 🗳️ Voting dashboard
- 📊 Results visualization

### 7. Test the Platform

#### Create an Identity

1. Navigate to "Identity" page
2. Click "Create Identity"
3. Fill in details:
   - Net Worth: encrypted with FHE
   - Domicile: 0-100
   - Tier: 0-10
   - PEP Status: Yes/No
   - Watchlist: 0-5
   - Risk Score: 0-100
4. Click "Create Encrypted Identity"
5. Approve MetaMask transaction

#### Create a Voting

1. Navigate to "Voting" page
2. Click "Create Voting"
3. Configure:
   - Name and description
   - Vote type (Single/Weighted/Quadratic)
   - Start and end time
   - Quorum requirement
4. Add voting options
5. Click "Create Voting"
6. Approve transaction

#### Cast a Vote

1. Browse active votings
2. Click on a voting
3. Select your choice
4. Submit encrypted vote
5. Approve transaction

---

## 📂 Deployment Files

After deployment, these files are created:

```
contracts/
├── deployments/
│   ├── sepolia-{timestamp}.json   # Deployment record
│   └── latest.json                 # Latest deployment
└── .env                            # Your config

frontend/
└── .env                            # Auto-generated config
```

**Deployment JSON structure:**
```json
{
  "network": "sepolia",
  "chainId": "11155111",
  "deployer": "0x...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "contracts": {
    "FHEIdentityVault": "0x...",
    "FHEBallot": "0x...",
    "FHEQuadraticVoting": "0x..."
  }
}
```

---

## 🔧 Troubleshooting

### Error: "Insufficient funds"

**Problem:** Deployer wallet has no Sepolia ETH

**Solution:**
```bash
# Get Sepolia ETH from faucets
# 1. Visit https://sepoliafaucet.com
# 2. Enter your wallet address
# 3. Wait for ETH to arrive
# 4. Check balance: node scripts/check-env.js
```

### Error: "Invalid private key"

**Problem:** Private key format is incorrect

**Solution:**
```bash
# Check your .env file
cd contracts
cat .env

# Ensure format is correct:
# ✅ PRIVATE_KEY=0x123...abc (66 chars with 0x)
# ✅ PRIVATE_KEY=123...abc    (64 chars without 0x)
# ❌ PRIVATE_KEY=your_private_key_here
```

### Error: "Cannot connect to RPC"

**Problem:** RPC URL is unreachable

**Solution:**
```bash
# Try alternative Sepolia RPCs in .env:
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
# or
SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

### Error: "Contract verification failed"

**Problem:** Etherscan API key is invalid or not set

**Solution:**
1. Get API key from https://etherscan.io/myapikey
2. Add to `.env`: `ETHERSCAN_API_KEY=YOUR_KEY`
3. Retry verification

### Frontend shows "Connect Wallet" but nothing happens

**Problem:** Wrong network or wallet not configured

**Solution:**
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia test network"
4. Refresh page
5. Try connecting again

### Votes not appearing in UI

**Problem:** Contract addresses in frontend `.env` are incorrect

**Solution:**
```bash
cd frontend
cat .env  # Check addresses

# Compare with deployment:
cd ../contracts
cat deployments/latest.json

# Update frontend .env if different
```

---

## 🔒 Security Best Practices

### For Development

1. **Use Test Wallets**
   - Create dedicated deployment wallet
   - Never use wallet with real funds
   - Keep only 0.1-0.2 ETH for deployments

2. **Private Key Management**
   - Never commit `.env` to git
   - Use environment variables in production
   - Rotate keys regularly

3. **Contract Verification**
   - Always verify contracts on Etherscan
   - Allows public audit of code
   - Builds user trust

### For Production

1. **Use Hardware Wallets**
   - Ledger or Trezor for deployment
   - Multi-sig for contract ownership

2. **Security Audits**
   - Get contracts professionally audited
   - Test thoroughly on testnet first
   - Monitor deployed contracts

3. **Access Control**
   - Use role-based access
   - Implement pause functionality
   - Set up monitoring alerts

---

## 📊 Gas Costs

**Estimated gas costs on Sepolia:**

| Contract | Deployment Gas | Cost (at 1 gwei) |
|----------|----------------|------------------|
| FHEIdentityVault | ~2.5M gas | ~0.0025 ETH |
| FHEBallot | ~4.5M gas | ~0.0045 ETH |
| FHEQuadraticVoting | ~5.0M gas | ~0.0050 ETH |
| **Total** | **~12M gas** | **~0.012 ETH** |

**Transaction costs:**
- Create Identity: ~500k gas (~0.0005 ETH)
- Create Voting: ~300k gas (~0.0003 ETH)
- Cast Vote: ~200k gas (~0.0002 ETH)

*Costs vary based on network congestion*

---

## 🌐 Network Information

### Sepolia Testnet

- **Chain ID:** 11155111
- **RPC URL:** https://ethereum-sepolia-rpc.publicnode.com
- **Explorer:** https://sepolia.etherscan.io
- **Faucets:**
  - https://sepoliafaucet.com
  - https://faucet.sepolia.dev

### Zama FHE Gateway

- **Gateway URL:** https://gateway.sepolia.zama.ai
- **Documentation:** https://docs.zama.ai

---

## 📚 Additional Resources

### Documentation
- [Zama FHE Docs](https://docs.zama.ai/fhevm)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/)

### Support
- **Issues:** Open GitHub issue
- **Community:** Zama Discord
- **Zama Website:** https://www.zama.ai

---

## ✅ Deployment Checklist

Before going live:

- [ ] Test all features on Sepolia testnet
- [ ] Verify all contracts on Etherscan
- [ ] Security audit completed
- [ ] Frontend UI/UX tested
- [ ] Gas optimization reviewed
- [ ] Documentation complete
- [ ] Backup deployment keys
- [ ] Monitor contracts after deployment
- [ ] Set up alerts for critical events
- [ ] Prepare incident response plan

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.

**Ready to deploy?** Start with the Quick Start guide above! 🚀
