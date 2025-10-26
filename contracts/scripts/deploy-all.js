const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Unified deployment script for all FHE contracts
 * Deploys: FHEIdentityVault, FHEBallot, FHEQuadraticVoting
 */
async function main() {
  console.log("🚀 Starting FHE Identity & Voting Platform deployment to Sepolia...\n");

  // Get deployer account
  const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, hre.ethers.provider);
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance < hre.ethers.parseEther("0.1")) {
    console.log("\n⚠️  WARNING: Low balance! Recommended: at least 0.1 ETH for deployment");
    console.log("Get Sepolia ETH from: https://sepoliafaucet.com\n");
  }

  const deployedContracts = {};

  // ═══════════════════════════════════════════════════════════════
  // 1. Deploy FHEIdentityVault
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📦 [1/3] Deploying FHEIdentityVault...");
  console.log("═".repeat(50));

  try {
    const FHEIdentityVault = await hre.ethers.getContractFactory("FHEIdentityVault", deployer);
    const identityVault = await FHEIdentityVault.deploy();
    await identityVault.waitForDeployment();
    const identityAddress = await identityVault.getAddress();

    console.log("✅ FHEIdentityVault deployed to:", identityAddress);
    deployedContracts.identityVault = identityAddress;

    // Wait for confirmations
    console.log("   ⏳ Waiting for 2 confirmations...");
    await identityVault.deploymentTransaction().wait(2);
    console.log("   ✅ Confirmed");
  } catch (error) {
    console.error("❌ Failed to deploy FHEIdentityVault:", error.message);
    throw error;
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Deploy FHEBallot
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📦 [2/3] Deploying FHEBallot...");
  console.log("═".repeat(50));

  try {
    const FHEBallot = await hre.ethers.getContractFactory("FHEBallot", deployer);
    const ballot = await FHEBallot.deploy();
    await ballot.waitForDeployment();
    const ballotAddress = await ballot.getAddress();

    console.log("✅ FHEBallot deployed to:", ballotAddress);
    deployedContracts.ballot = ballotAddress;

    // Wait for confirmations
    console.log("   ⏳ Waiting for 2 confirmations...");
    await ballot.deploymentTransaction().wait(2);
    console.log("   ✅ Confirmed");
  } catch (error) {
    console.error("❌ Failed to deploy FHEBallot:", error.message);
    throw error;
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Deploy FHEQuadraticVoting
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📦 [3/3] Deploying FHEQuadraticVoting...");
  console.log("═".repeat(50));

  try {
    const FHEQuadraticVoting = await hre.ethers.getContractFactory("FHEQuadraticVoting", deployer);
    const quadraticVoting = await FHEQuadraticVoting.deploy();
    await quadraticVoting.waitForDeployment();
    const quadraticAddress = await quadraticVoting.getAddress();

    console.log("✅ FHEQuadraticVoting deployed to:", quadraticAddress);
    deployedContracts.quadraticVoting = quadraticAddress;

    // Wait for confirmations
    console.log("   ⏳ Waiting for 2 confirmations...");
    await quadraticVoting.deploymentTransaction().wait(2);
    console.log("   ✅ Confirmed");
  } catch (error) {
    console.error("❌ Failed to deploy FHEQuadraticVoting:", error.message);
    throw error;
  }

  // ═══════════════════════════════════════════════════════════════
  // Save Deployment Information
  // ═══════════════════════════════════════════════════════════════
  console.log("\n💾 Saving deployment information...");

  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      FHEIdentityVault: deployedContracts.identityVault,
      FHEBallot: deployedContracts.ballot,
      FHEQuadraticVoting: deployedContracts.quadraticVoting,
    },
    gasUsed: {
      note: "Gas usage varies based on network conditions",
    },
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save with timestamp
  const timestamp = Date.now();
  const deploymentFile = path.join(deploymentsDir, `sepolia-${timestamp}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Save as latest
  const latestFile = path.join(deploymentsDir, "latest.json");
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("✅ Deployment info saved:");
  console.log("   📄", deploymentFile);
  console.log("   📄", latestFile);

  // ═══════════════════════════════════════════════════════════════
  // Generate Frontend .env Configuration
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📝 Generating frontend .env configuration...");

  const frontendEnv = `# Auto-generated from deployment on ${new Date().toISOString()}
# Contract Addresses (Sepolia Testnet)
VITE_IDENTITY_VAULT_ADDRESS=${deployedContracts.identityVault}
VITE_BALLOT_ADDRESS=${deployedContracts.ballot}
VITE_QUADRATIC_VOTING_ADDRESS=${deployedContracts.quadraticVoting}

# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai

# WalletConnect (Optional - get from https://cloud.walletconnect.com/)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
`;

  const frontendEnvFile = path.join(__dirname, "../../frontend/.env");
  fs.writeFileSync(frontendEnvFile, frontendEnv);
  console.log("✅ Frontend .env created:", frontendEnvFile);

  // ═══════════════════════════════════════════════════════════════
  // Deployment Summary
  // ═══════════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(70));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("═".repeat(70));
  console.log("\n📋 Deployed Contracts:");
  console.log("───────────────────────────────────────────────────────────────────");
  console.log("FHEIdentityVault:     ", deployedContracts.identityVault);
  console.log("FHEBallot:            ", deployedContracts.ballot);
  console.log("FHEQuadraticVoting:   ", deployedContracts.quadraticVoting);
  console.log("───────────────────────────────────────────────────────────────────");

  console.log("\n🔗 View on Sepolia Etherscan:");
  console.log("Identity Vault:  ", `https://sepolia.etherscan.io/address/${deployedContracts.identityVault}`);
  console.log("Ballot:          ", `https://sepolia.etherscan.io/address/${deployedContracts.ballot}`);
  console.log("Quadratic Voting:", `https://sepolia.etherscan.io/address/${deployedContracts.quadraticVoting}`);

  console.log("\n📝 Next Steps:");
  console.log("───────────────────────────────────────────────────────────────────");
  console.log("1. ✅ Frontend .env already updated with contract addresses");
  console.log("2. 🚀 Start frontend: cd ../frontend && npm run dev");
  console.log("3. 🔗 Connect your wallet to Sepolia network");
  console.log("4. 🎭 Create identity and test voting!");
  console.log("───────────────────────────────────────────────────────────────────");

  // Optional: Contract verification
  if (process.env.ETHERSCAN_API_KEY && process.env.ETHERSCAN_API_KEY !== "your_etherscan_api_key_here") {
    console.log("\n🔍 Etherscan verification available");
    console.log("Run manually:");
    console.log(`  npx hardhat verify --network sepolia ${deployedContracts.identityVault}`);
    console.log(`  npx hardhat verify --network sepolia ${deployedContracts.ballot}`);
    console.log(`  npx hardhat verify --network sepolia ${deployedContracts.quadraticVoting}`);
  } else {
    console.log("\n💡 Tip: Add ETHERSCAN_API_KEY to .env for automatic contract verification");
  }

  console.log("\n✨ Deployment successful! Happy building! ✨\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
