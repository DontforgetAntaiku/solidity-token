const hre = require("hardhat");

async function main() {
  const name = "FeeToken";
  const symbol = "FEE";
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1M tokens
  const feePercent = 1000; // 10%

  const FeeToken = await hre.ethers.getContractFactory("FeeToken");
  const token = await FeeToken.deploy(name, symbol, initialSupply, feePercent);

  await token.waitForDeployment();

  console.log(`Token deployed to: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
