require("dotenv").config();
const hre = require("hardhat");

async function main() {
  console.log("Creating 10 votings on Sepolia...\n");

  const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, hre.ethers.provider);
  console.log("Creating with account:", deployer.address);

  // Use deployed contract addresses
  const ballotAddress = "0xdb87F76ceA345f6fC0eCA788470Ccd5633071b3D";

  const FHEBallot = await hre.ethers.getContractFactory("FHEBallot", deployer);
  const ballot = FHEBallot.attach(ballotAddress);

  // Get current block timestamp
  const block = await hre.ethers.provider.getBlock("latest");
  const now = block.timestamp;

  // Start 2 minutes from now (to avoid startTime < block.timestamp validation error)
  const startTime = now + 120;

  // 1 month from start time (30 days)
  const oneMonthLater = startTime + (30 * 24 * 60 * 60);

  // 10 voting proposals
  const votings = [
    {
      name: "Protocol Upgrade Proposal v2.0",
      description: "Vote on implementing the new FHE optimization improvements to reduce gas costs by 40%",
      voteType: 2, // Weighted
      options: ["Approve Upgrade", "Reject Upgrade", "Need More Testing", "Abstain"],
      descriptions: [
        "Implement the upgrade immediately",
        "Reject the proposed changes",
        "Request additional testing period",
        "Abstain from this decision"
      ]
    },
    {
      name: "Treasury Allocation Q1 2025",
      description: "Decide how to allocate 500,000 tokens from the community treasury for Q1 2025 initiatives",
      voteType: 0, // Single Choice
      options: ["DeFi Partnerships", "Developer Grants", "Marketing Campaign", "Security Audits", "Reserve Fund"],
      descriptions: [
        "Invest in strategic DeFi protocol partnerships",
        "Fund developer grants and hackathons",
        "Launch comprehensive marketing campaign",
        "Conduct thorough security audits",
        "Keep funds in reserve for future opportunities"
      ]
    },
    {
      name: "Grant Program: Cross-Chain Bridge",
      description: "Should we fund the development of a cross-chain bridge to Ethereum and other L1s?",
      voteType: 0,
      options: ["Fund Full Amount (100k)", "Fund Partial (50k)", "Reject Proposal", "Request Revised Proposal"],
      descriptions: [
        "Approve full 100,000 token grant",
        "Approve partial 50,000 token grant",
        "Reject the grant application",
        "Request revised proposal with more details"
      ]
    },
    {
      name: "Governance Framework Update",
      description: "Update the governance framework to include new voting mechanisms and quorum requirements",
      voteType: 0,
      options: ["Approve All Changes", "Approve Partially", "Reject Changes", "Modify Proposal"],
      descriptions: [
        "Accept all proposed framework changes",
        "Accept some changes, reject others",
        "Reject all proposed changes",
        "Send back for modifications"
      ]
    },
    {
      name: "Fee Structure Adjustment",
      description: "Vote on the new fee structure for the platform to balance sustainability and growth",
      voteType: 1, // Multiple choice
      options: ["0.1% Fee", "0.25% Fee", "0.5% Fee", "Dynamic Fee Model", "No Change"],
      descriptions: [
        "Set flat fee at 0.1% (lowest)",
        "Set flat fee at 0.25% (moderate)",
        "Set flat fee at 0.5% (highest)",
        "Implement dynamic fee based on volume",
        "Keep current fee structure"
      ]
    },
    {
      name: "Staking Rewards APY Rate",
      description: "Adjust the staking rewards annual percentage yield for token holders",
      voteType: 0,
      options: ["5% APY", "8% APY", "10% APY", "12% APY", "15% APY"],
      descriptions: [
        "Conservative 5% annual yield",
        "Moderate 8% annual yield",
        "Competitive 10% annual yield",
        "Aggressive 12% annual yield",
        "High-risk 15% annual yield"
      ]
    },
    {
      name: "Partnership with Layer 2 Solutions",
      description: "Should we integrate with Layer 2 scaling solutions to reduce transaction costs?",
      voteType: 0,
      options: ["Arbitrum", "Optimism", "zkSync", "All Three", "None"],
      descriptions: [
        "Deploy on Arbitrum only",
        "Deploy on Optimism only",
        "Deploy on zkSync only",
        "Deploy on all three L2 solutions",
        "Do not deploy on any L2"
      ]
    },
    {
      name: "Annual Roadmap 2025 Feature Priority",
      description: "Vote on the priority features for 2025 development roadmap",
      voteType: 2, // Weighted
      options: ["Mobile App", "Advanced Analytics", "NFT Integration", "DAO Governance Tools", "API v3"],
      descriptions: [
        "Develop native mobile application",
        "Build comprehensive analytics dashboard",
        "Add NFT support and marketplace",
        "Implement full DAO governance suite",
        "Launch new API version with webhooks"
      ]
    },
    {
      name: "Community Fund Distribution",
      description: "Vote on distributing community funds to various initiatives and programs",
      voteType: 3, // Quadratic
      options: ["Education Programs", "Bug Bounties", "Community Events", "Content Creation", "Research Grants"],
      descriptions: [
        "Fund blockchain education initiatives",
        "Increase bug bounty rewards",
        "Organize meetups and conferences",
        "Support content creators",
        "Finance research and development"
      ]
    },
    {
      name: "Emergency Response Fund Creation",
      description: "Create a 200,000 token emergency fund for critical security issues and urgent needs",
      voteType: 0,
      options: ["Approve Fund", "Reject Fund", "Reduce to 100k", "Increase to 300k"],
      descriptions: [
        "Create 200,000 token emergency fund",
        "Do not create emergency fund",
        "Create smaller 100,000 token fund",
        "Create larger 300,000 token fund"
      ]
    }
  ];

  console.log(`Creating ${votings.length} votings (all ending in 1 month)...\n`);

  for (let i = 0; i < votings.length; i++) {
    const voting = votings[i];
    console.log(`[${i + 1}/${votings.length}] Creating: ${voting.name}`);

    try {
      const votingConfig = {
        name: voting.name,
        description: voting.description,
        voteType: voting.voteType,
        startTime: startTime, // Start in 2 minutes
        endTime: oneMonthLater, // End in 1 month from start
        quorum: 10, // Require 10 votes
        whitelistEnabled: false,
        maxVotersCount: 1000000
      };

      const tx = await ballot.createVoting(
        votingConfig,
        voting.options,
        voting.descriptions,
        { gasLimit: 5000000 } // Set higher gas limit
      );

      console.log(`  Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();

      // Get voting ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = ballot.interface.parseLog(log);
          return parsed?.name === "VotingCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = ballot.interface.parseLog(event);
        const votingId = parsedEvent.args[0];
        console.log(`  ✓ Created voting ID: ${votingId}`);
        console.log(`  Status: Active (ends in 30 days)`);
        console.log(`  Options: ${voting.options.length}`);
      }

    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
      if (error.reason) console.log(`  Reason: ${error.reason}`);
    }

    // Longer delay between transactions to avoid rate limiting
    console.log("");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("✅ All votings created successfully!");
  console.log(`\nAll votings will end on: ${new Date(oneMonthLater * 1000).toLocaleString()}`);
  console.log(`Contract address: ${ballotAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
