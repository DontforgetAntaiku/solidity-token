require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const name = process.env.TOKEN_NAME;
  const symbol = process.env.TOKEN_SYMBOL;
  const initialSupply = hre.ethers.parseUnits(process.env.TOKEN_SUPPLY, 18);
  const feePercent = parseInt(process.env.FEE_PERCENT);
  const feeCollector = process.env.FEE_COLLECTOR;

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(
    name,
    symbol,
    initialSupply,
    feePercent,
    feeCollector
  );

  await token.waitForDeployment();

  console.log(`Token deployed to: ${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
