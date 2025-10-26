const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

/**
 * Pre-deployment environment check script
 * Validates .env configuration and network connectivity
 */
async function main() {
  console.log("🔍 Checking deployment environment...\n");

  let hasErrors = false;
  let hasWarnings = false;

  // ═══════════════════════════════════════════════════════════════
  // 1. Check .env file exists
  // ═══════════════════════════════════════════════════════════════
  console.log("📄 [1/6] Checking .env file...");
  const envPath = path.join(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    console.log("❌ .env file not found!");
    console.log("   Create it from: cp .env.example .env");
    hasErrors = true;
  } else {
    console.log("✅ .env file exists");
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Check PRIVATE_KEY
  // ═══════════════════════════════════════════════════════════════
  console.log("\n🔑 [2/6] Checking PRIVATE_KEY...");
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.log("❌ PRIVATE_KEY not set in .env");
    hasErrors = true;
  } else if (privateKey === "your_private_key_here" || privateKey.length < 64) {
    console.log("❌ PRIVATE_KEY is invalid or not configured");
    console.log("   Add your private key to .env (WITHOUT 0x prefix)");
    hasErrors = true;
  } else if (!privateKey.startsWith("0x") && privateKey.length === 64) {
    console.log("✅ PRIVATE_KEY configured (66 chars with 0x)");

    try {
      const wallet = new ethers.Wallet("0x" + privateKey);
      console.log("   Deployer address:", wallet.address);
    } catch (error) {
      console.log("❌ PRIVATE_KEY is invalid:", error.message);
      hasErrors = true;
    }
  } else if (privateKey.startsWith("0x") && privateKey.length === 66) {
    console.log("✅ PRIVATE_KEY configured");

    try {
      const wallet = new ethers.Wallet(privateKey);
      console.log("   Deployer address:", wallet.address);
    } catch (error) {
      console.log("❌ PRIVATE_KEY is invalid:", error.message);
      hasErrors = true;
    }
  } else {
    console.log("❌ PRIVATE_KEY has invalid length");
    console.log("   Expected: 64 chars (without 0x) or 66 chars (with 0x)");
    console.log("   Got:", privateKey.length, "chars");
    hasErrors = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Check RPC URL
  // ═══════════════════════════════════════════════════════════════
  console.log("\n🌐 [3/6] Checking SEPOLIA_RPC_URL...");
  const rpcUrl = process.env.SEPOLIA_RPC_URL;

  if (!rpcUrl) {
    console.log("❌ SEPOLIA_RPC_URL not set in .env");
    hasErrors = true;
  } else {
    console.log("✅ SEPOLIA_RPC_URL:", rpcUrl);

    try {
      console.log("   Testing connection...");
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const network = await provider.getNetwork();

      if (network.chainId.toString() !== "11155111") {
        console.log("⚠️  WARNING: Connected to chain", network.chainId, "but expected Sepolia (11155111)");
        hasWarnings = true;
      } else {
        console.log("✅ Connected to Sepolia (chainId: 11155111)");
      }

      const blockNumber = await provider.getBlockNumber();
      console.log("✅ Current block:", blockNumber);
    } catch (error) {
      console.log("❌ Failed to connect to RPC:", error.message);
      hasErrors = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. Check deployer balance
  // ═══════════════════════════════════════════════════════════════
  console.log("\n💰 [4/6] Checking deployer balance...");

  if (!hasErrors && privateKey && rpcUrl) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(
        privateKey.startsWith("0x") ? privateKey : "0x" + privateKey,
        provider
      );

      const balance = await provider.getBalance(wallet.address);
      const balanceETH = ethers.formatEther(balance);

      console.log("   Address:", wallet.address);
      console.log("   Balance:", balanceETH, "ETH");

      if (balance === 0n) {
        console.log("❌ Deployer has 0 ETH!");
        console.log("   Get Sepolia ETH from faucets:");
        console.log("   • https://sepoliafaucet.com");
        console.log("   • https://faucet.sepolia.dev");
        hasErrors = true;
      } else if (parseFloat(balanceETH) < 0.05) {
        console.log("⚠️  WARNING: Low balance (< 0.05 ETH)");
        console.log("   Recommended: at least 0.1 ETH for deployment");
        hasWarnings = true;
      } else {
        console.log("✅ Sufficient balance for deployment");
      }
    } catch (error) {
      console.log("❌ Failed to check balance:", error.message);
      hasErrors = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. Check contract files
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📦 [5/6] Checking contract files...");

  const contracts = [
    "src/FHEIdentityVault.sol",
    "src/FHEBallot.sol",
    "src/FHEQuadraticVoting.sol",
  ];

  let allContractsExist = true;
  for (const contract of contracts) {
    const contractPath = path.join(__dirname, "..", contract);
    if (fs.existsSync(contractPath)) {
      console.log(`✅ ${contract}`);
    } else {
      console.log(`❌ ${contract} not found`);
      allContractsExist = false;
      hasErrors = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. Check deployments directory
  // ═══════════════════════════════════════════════════════════════
  console.log("\n📁 [6/6] Checking deployments directory...");

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    console.log("⚠️  Deployments directory doesn't exist (will be created)");
    hasWarnings = true;
  } else {
    console.log("✅ Deployments directory exists");

    const files = fs.readdirSync(deploymentsDir);
    if (files.length > 0) {
      console.log(`   Found ${files.length} previous deployment(s)`);
      const latest = files.filter(f => f.endsWith(".json")).sort().pop();
      if (latest) {
        console.log(`   Latest: ${latest}`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(70));

  if (hasErrors) {
    console.log("❌ ENVIRONMENT CHECK FAILED");
    console.log("═".repeat(70));
    console.log("\nPlease fix the errors above before deploying.\n");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️  ENVIRONMENT CHECK PASSED WITH WARNINGS");
    console.log("═".repeat(70));
    console.log("\nYou can proceed with deployment, but review the warnings above.\n");
    process.exit(0);
  } else {
    console.log("✅ ENVIRONMENT CHECK PASSED");
    console.log("═".repeat(70));
    console.log("\n🚀 Ready to deploy! Run:");
    console.log("   npx hardhat run scripts/deploy-all.js --network sepolia\n");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("\n❌ Check failed:");
  console.error(error);
  process.exit(1);
});
