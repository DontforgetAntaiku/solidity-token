const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const token = await hre.ethers.getContractAt("Token", "TOKEN_ADDRESS");
    const tokenBalance = await token.balanceOf(account.address);
    console.log(
      `${account.address} has ${hre.ethers.formatUnits(
        tokenBalance,
        18
      )} Tokens`
    );
    const balance = await hre.ethers.provider.getBalance(account.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
