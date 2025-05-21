const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const sender = await hre.ethers.getSigner('SENDER_WALLET');
  const receiver = await hre.ethers.getSigner('RECEIVER_WALLET');
  const token = await hre.ethers.getContractAt("Token", "TOKEN_ADDRESS", sender);

  const amount = hre.ethers.parseUnits("1000", 18);

  const tx = await token.transfer(receiver.address, amount);
  await tx.wait();

  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
