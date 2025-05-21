# Solidity Token

A simple ERC‑20 token with a built‑in transfer fee, powered by Hardhat.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Local Development](#local-development)
* [Compilation & Testing](#compilation--testing)
* [Deployment](#deployment)
* [Contract Architecture](#contract-architecture)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

This repository implements an ERC‑20 token in Solidity (v0.8.20) that charges a configurable fee (in basis points) on each transfer. All collected fees are forwarded to the deployer’s address.

## Features

* Standard ERC‑20 interface (OpenZeppelin).
* **Transfer Fee**: Deducts a % (basis points) on every transfer.
* Immutable configuration: name, symbol, supply, and fee rate set at deployment.
* Hardhat framework for compilation, testing, and scripting.

## Prerequisites

* Node.js (>=16.x)
* npm or yarn
* An Ethereum JSON‑RPC endpoint URL (e.g. Alchemy, Infura)
* A wallet private key with funds for gas

## Installation

```bash
# Clone
git clone https://github.com/DontforgetAntaiku/solidity-token.git
cd solidity-token

# Install dependencies
npm install
# or
yarn install
```

## Configuration

1. **Environment Variables**

   Rename `.env.example` to `.env` and set your private key:

   ```ini
   # .env
   PRIVATE_KEY=yourprivatekey
   API_KEY=yourapikeyofinfura
   TOKEN_NAME=name
   TOKEN_SYMBOL=symbol
   TOKEN_SUPPLY=1000000
   FEE_PERCENT=1000 # 10%
   FEE_COLLECTOR=youraddress
   ```

2. **hardhat.config.js**

   Update the `rinkeby` network (or add others) with your RPC URL and private key:

   ```js
   networks: {
     hardhat: {},
     rinkeby: {
       url: URL,
       accounts: [process.env.PRIVATE_KEY],
     },
   }
   ```

## Local Development

Launch a local Hardhat node and deploy:

```bash
# Start local node (fork or fresh)
npx hardhat node

# In a new terminal, deploy to localhost
npx hardhat run scripts/deploy.js --network localhost
```

Contracts will be deployed to `http://127.0.0.1:8545` and you can interact via the provided addresses.

## Compilation & Testing

Compile contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```
## Contract Architecture

* **contracts/token.sol** inherits from OpenZeppelin's `ERC20`.
* Overrides `_transfer` to:

  1. Calculate `fee = (amount * feePercent) / 10_000`.
  2. Transfer `fee` to `feeCollector` (deployer).
  3. Transfer `amount - fee` to the recipient.

Key constructor parameters:

```solidity
constructor(
  string memory name_,
  string memory symbol_,
  uint256 initialSupply_,
  uint256 feePercent_ // in basis points (bps)
) ERC20(name_, symbol_) {
  feeCollector = msg.sender;
  feePercent = feePercent_;
  _mint(msg.sender, initialSupply_);
}
```