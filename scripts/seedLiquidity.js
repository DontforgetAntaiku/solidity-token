// scripts/seedLiquidity.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Router:", process.env.ROUTER_ADDRESS);
  console.log("Deployer:", await deployer.getAddress());

  // 1) Get your token & router
  const token = await ethers.getContractAt(
    "IERC20",
    process.env.TOKEN_ADDRESS,
    deployer
  );
  const routerAbi = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)",
    "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory)",
  ];

  const router = new ethers.Contract(
    process.env.ROUTER_ADDRESS,
    routerAbi,
    deployer
  );

  console.log(router.target);
  // 2) Decide amounts
  const tokenAmount = ethers.parseUnits("1000000", 18); // 1 000 000 tokens
  const ethAmount = ethers.parseEther("0.0001"); // 0.0001 ETH

  // 3) Approve router to spend your tokens
  console.log("Approving router…");
  await (await token.approve(router.target, tokenAmount)).wait();

  // 4) Add liquidity
  console.log(
    "Adding liquidity:",
    tokenAmount.toString(),
    "tokens +",
    ethAmount.toString(),
    "ETH"
  );
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const receipt = await router.addLiquidityETH(
    process.env.TOKEN_ADDRESS,
    tokenAmount,
    0,
    0,
    await deployer.getAddress(),
    Math.floor(Date.now() / 1000) + 600,
    { value: ethAmount }
  );
  console.log("Liquidity tx:", receipt.transactionHash);

  // 5) DONE
  console.log("✅ Pool seeded! Now verifying quote…");
  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    "function allPairsLength() external view returns (uint)",
  ];

  const factory = new ethers.Contract(
    process.env.FACTORY_ADDRESS,
    factoryAbi,
    ethers.provider
  );

  const pairAddr = await factory.getPair(
    process.env.TOKEN_ADDRESS,
    process.env.WETH_ADDRESS
  );
  console.log("Pair address:", pairAddr);
  const reserves = await ethers
    .getContractAt(
      [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      ],
      pairAddr,
      deployer
    )
    .then((c) => c.getReserves());

  console.log(
    "Reserves:",
    reserves.reserve0.toString(),
    reserves.reserve1.toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
