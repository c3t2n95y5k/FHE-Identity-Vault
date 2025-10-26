const hre = require("hardhat");

async function main() {
  const ballotAddress = "0xdb87F76ceA345f6fC0eCA788470Ccd5633071b3D";
  const FHEBallot = await hre.ethers.getContractFactory("FHEBallot");
  const ballot = FHEBallot.attach(ballotAddress);

  const counter = await ballot.votingIdCounter();
  console.log("votingIdCounter:", counter.toString());

  if (counter > 0) {
    console.log("\nFirst voting details:");
    const voting = await ballot.votings(0);
    console.log("Name:", voting.config.name);
    console.log("Description:", voting.config.description);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
