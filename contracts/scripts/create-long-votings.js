const hre = require("hardhat");
const { ethers } = require("hardhat");

/**
 * Create multiple long-duration voting tests on Sepolia
 * These votings will be active for extended periods to allow testing
 */
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x79A0B5B310313143d3230d2D16EDE4C4DaaF3ac4";

  const [signer] = await ethers.getSigners();
  console.log("═".repeat(60));
  console.log("🗳️  Creating Long-Duration Voting Tests");
  console.log("═".repeat(60));
  console.log("Using signer:", signer.address);
  console.log("Network:", hre.network.name);
  console.log("FHEBallot:", contractAddress);
  console.log("");

  const ballot = await ethers.getContractAt("FHEBallot", contractAddress, signer);

  const now = Math.floor(Date.now() / 1000);
  const HOUR = 3600;
  const DAY = 24 * HOUR;

  // Define multiple voting configurations
  const votings = [
    {
      config: {
        name: "Community Treasury Allocation Q1 2025",
        description: "Decide how to allocate the community treasury funds for the first quarter of 2025. Options include development grants, marketing initiatives, and ecosystem partnerships.",
        voteType: 0, // SingleChoice
        startTime: now + 60, // Start in 1 minute
        endTime: now + 7 * DAY, // End in 7 days
        quorum: 10,
        whitelistEnabled: false,
        maxVotersCount: 10000,
      },
      optionNames: ["Development Grants", "Marketing", "Partnerships", "Reserve"],
      optionDescriptions: [
        "Fund developer grants and hackathons",
        "Invest in marketing and brand awareness",
        "Build strategic ecosystem partnerships",
        "Keep in reserve for future opportunities"
      ]
    },
    {
      config: {
        name: "Protocol Upgrade Proposal #42",
        description: "Vote on implementing the new consensus mechanism upgrade that promises 50% faster finality and reduced gas costs.",
        voteType: 0, // SingleChoice
        startTime: now + 60,
        endTime: now + 14 * DAY, // End in 14 days
        quorum: 5,
        whitelistEnabled: false,
        maxVotersCount: 5000,
      },
      optionNames: ["Approve Upgrade", "Reject Upgrade", "Request More Research"],
      optionDescriptions: [
        "Approve and proceed with the upgrade",
        "Reject the proposal",
        "Request additional research before decision"
      ]
    },
    {
      config: {
        name: "Governance Token Emission Schedule",
        description: "Choose the emission schedule for the governance token over the next year. This will affect staking rewards and inflation.",
        voteType: 0, // SingleChoice
        startTime: now + 60,
        endTime: now + 10 * DAY, // End in 10 days
        quorum: 20,
        whitelistEnabled: false,
        maxVotersCount: 8000,
      },
      optionNames: ["Conservative (5%)", "Moderate (10%)", "Aggressive (15%)"],
      optionDescriptions: [
        "5% annual emission - lower inflation, lower rewards",
        "10% annual emission - balanced approach",
        "15% annual emission - higher rewards, higher inflation"
      ]
    },
    {
      config: {
        name: "New Feature Priority Poll",
        description: "Help us prioritize the development roadmap by voting on which features you want to see implemented first.",
        voteType: 0, // SingleChoice
        startTime: now + 60,
        endTime: now + 5 * DAY, // End in 5 days
        quorum: 3,
        whitelistEnabled: false,
        maxVotersCount: 20000,
      },
      optionNames: ["Mobile App", "Cross-chain Bridge", "NFT Integration", "DAO Tooling"],
      optionDescriptions: [
        "Native mobile application for iOS and Android",
        "Bridge to connect with other blockchain networks",
        "Integrate NFT minting and trading capabilities",
        "Advanced tools for DAO management and voting"
      ]
    },
    {
      config: {
        name: "Community Council Election 2025",
        description: "Elect 3 representatives to serve on the Community Council for the 2025 term. Council members will help guide protocol development and community initiatives.",
        voteType: 0, // SingleChoice (in real scenario would be multi-choice)
        startTime: now + 60,
        endTime: now + 21 * DAY, // End in 21 days
        quorum: 50,
        whitelistEnabled: false,
        maxVotersCount: 15000,
      },
      optionNames: ["Alice.eth", "Bob.eth", "Carol.eth", "Dave.eth", "Eve.eth"],
      optionDescriptions: [
        "Core contributor since 2022, focus on DeFi",
        "Community manager, focus on engagement",
        "Security researcher, focus on audits",
        "Developer advocate, focus on education",
        "Marketing lead, focus on growth"
      ]
    }
  ];

  const createdVotings = [];

  for (let i = 0; i < votings.length; i++) {
    const voting = votings[i];
    console.log(`\n📦 [${i + 1}/${votings.length}] Creating: ${voting.config.name}`);
    console.log("─".repeat(50));

    try {
      const tx = await ballot.createVoting(
        voting.config,
        voting.optionNames,
        voting.optionDescriptions
      );

      console.log("   ⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("   ✅ TX Hash:", receipt.hash);

      // Parse VotingCreated event
      const iface = new ethers.Interface([
        "event VotingCreated(uint256 indexed votingId, string name, uint8 voteType, uint256 startTime, uint256 endTime)",
      ]);

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({ topics: log.topics, data: log.data });
          if (parsed?.name === "VotingCreated") {
            const votingId = parsed.args.votingId.toString();
            console.log("   📝 Voting ID:", votingId);

            const durationDays = Math.round((voting.config.endTime - voting.config.startTime) / DAY);
            console.log(`   ⏰ Duration: ${durationDays} days`);
            console.log(`   🗳️ Options: ${voting.optionNames.join(", ")}`);

            createdVotings.push({
              id: votingId,
              name: voting.config.name,
              durationDays,
              txHash: receipt.hash
            });
          }
        } catch (_) {}
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("🎉 VOTING CREATION COMPLETE!");
  console.log("═".repeat(60));
  console.log("\n📋 Created Votings Summary:");
  console.log("─".repeat(60));

  for (const v of createdVotings) {
    console.log(`ID ${v.id}: ${v.name} (${v.durationDays} days)`);
    console.log(`   https://sepolia.etherscan.io/tx/${v.txHash}`);
  }

  console.log("─".repeat(60));
  console.log(`\n✅ Total: ${createdVotings.length} votings created`);
  console.log(`📍 Contract: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
