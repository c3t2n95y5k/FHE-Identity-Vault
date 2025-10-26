const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying FHEIdentityVault contract to Sepolia...");

  // Get deployer account using direct wallet connection
  const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, hre.ethers.provider);
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy FHEIdentityVault
  const FHEIdentityVault = await hre.ethers.getContractFactory("FHEIdentityVault", deployer);

  console.log("\n⏳ Deploying contract...");
  const contract = await FHEIdentityVault.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ FHEIdentityVault deployed to:", address);
  console.log("\n📋 Deployment Summary:");
  console.log("=====================================");
  console.log("Contract Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("=====================================");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployments/identity-vault-latest.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to deployments/identity-vault-latest.json");

  // Wait for block confirmations before verification
  console.log("\n⏳ Waiting for 5 block confirmations...");
  await contract.deploymentTransaction().wait(5);

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Update frontend .env with contract address:", address);
  console.log("2. Run: cd ../frontend && npm run dev");
  console.log("3. Test identity creation with encrypted netWorth");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
