# solidity-token

A simple ERC-20 token smart contract with a built-in transfer fee mechanism. Every transfer deducts a configurable percentage fee which is automatically sent to the deployer’s address.

---

## Table of Contents

- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
  - [Deploying Locally](#deploying-locally)  
  - [Interacting with the Contract](#interacting-with-the-contract)  
- [Running Tests](#running-tests)  
- [Project Structure](#project-structure)  
- [Contract Details](#contract-details)  
- [License](#license)  

---

## Features

- **ERC-20 Compatible**  
- **Configurable Transfer Fee**: Deducts a basis-points fee (e.g. 100 = 1%) on each transfer.  
- **Automatic Fee Collection**: All fees are sent to the address that deployed the contract.  
- **Easy to Customize**: Name, symbol, initial supply, and fee percentage are all constructor parameters.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [Hardhat](https://hardhat.org/) (installed as a dev dependency)  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/DontforgetAntaiku/solidity-token.git
   cd solidity-token
   ```
2. **Install dependencies**  
   ```bash
   npm install
   ```
   or, if using yarn:
   ```bash
   yarn install
   ```

---

## Configuration

By default, this project uses Hardhat’s local network. You can customize networks in `hardhat.config.js`:

```js
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: { /* local testing */ },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
    // add other networks as needed
  },
};
```

Make sure to set environment variables for any public testnet or mainnet deployments:
```bash
export RINKEBY_RPC_URL="https://..."
export PRIVATE_KEY="0x..."
```

---

## Usage

### Deploying Locally

1. **Compile the contracts**  
   ```bash
   npx hardhat compile
   ```

2. **Run the deployment script**  
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```
   By default, the script deploys a token named `"FeeToken"` with symbol `"FEE"`, an initial supply of **1 000 000** tokens, and a **10%** transfer fee.  
   You can edit `scripts/deploy.js` to change these parameters.

### Interacting with the Contract

After deployment, you’ll see an output like:

```
Token deployed to: 0xAbC123...
```

You can then interact via:

- **Hardhat Console**  
  ```bash
  npx hardhat console --network hardhat
  ```
  ```js
  const [deployer, user] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const token = Token.attach("0xAbC123...");

  // Transfer 1000 tokens from deployer to user:
  await token.transfer(user.address, ethers.parseUnits("1000", 18));

  // Check balances:
  (await token.balanceOf(user.address)).toString();  // user’s balance after fee
  (await token.balanceOf(deployer.address)).toString();  // deployer’s remaining + fees
  ```

- **Ethers.js / Web3.js**  
  Use standard ERC-20 ABI methods. Note `_transfer` has been overridden to include fees.

---

## Running Tests

This project includes a basic test suite using Hardhat and Chai.

```bash
npx hardhat test
```

#### What’s Covered

- **Initial Supply**: Owner receives the full minted amount.  
- **Transfer Fee**: Verifies that the correct fee is deducted and sent to the fee collector.

---

## Project Structure

```
.
├── contracts
│   └── token.sol        # ERC-20 token with fee logic
├── scripts
│   └── deploy.js        # Deployment script (Hardhat)
├── test
│   └── Token.test.js    # Unit tests (Hardhat + Chai)
├── package.json         # Project dependencies
└── hardhat.config.js    # Hardhat configuration
```

---

## Contract Details

### `Token` (in `contracts/token.sol`)

```solidity
contract Token is ERC20 {
    address public feeCollector;
    uint256 public feePercent; // in basis points (e.g. 100 = 1%)

    constructor(
        string memory name,
        string memory symbol,
        uint256 mintAmount,
        uint256 _feePercent
    ) ERC20(name, symbol) {
        feeCollector = msg.sender;
        feePercent = _feePercent;
        _mint(msg.sender, mintAmount * 10 ** decimals());
    }

    // Overrides transfer to apply fee
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 fee = (amount * feePercent) / 10000;
        uint256 amountAfterFee = amount - fee;
        super._transfer(sender, feeCollector, fee);
        super._transfer(sender, recipient, amountAfterFee);
    }
}
```

- **`feeCollector`**: the address that collects fees (deployer).  
- **`feePercent`**: fee rate in basis points, so a value of `1000` equals **10%**.  

---
