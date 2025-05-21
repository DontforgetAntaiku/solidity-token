const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const receiver = await hre.ethers.getSigner('WALLET_RECEIVER');
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.attach("TOKEN_ADDRESS");

  const tx = await token.transfer(receiver.address, hre.ethers.parseUnits("1000", 0));
  await tx.wait();

  const balance = await token.balanceOf(receiver.address);
  console.log(`Recipient balance: ${hre.ethers.formatUnits(balance, 18)} tokens`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
