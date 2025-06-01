Based on the latest updates in the [DontforgetAntaiku/solidity-token](https://github.com/DontforgetAntaiku/solidity-token) repository, here's an updated `README.md` that reflects the current state of the project:

---

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

---

## Overview

This repository implements an ERC‑20 token in Solidity (v0.8.20) that charges a configurable fee (in basis points) on each transfer. All collected fees are forwarded to the deployer’s address.

## Features

* Standard ERC‑20 interface (OpenZeppelin-based)
* Transfer fee mechanism (configurable in basis points)
* Fee collection directed to the deployer's address
* Built-in tests using Hardhat and Mocha
* Deployment scripts included

## Prerequisites

* Node.js (v16 or later)
* npm or yarn
* Hardhat

## Installation

```bash
git clone https://github.com/DontforgetAntaiku/solidity-token.git
cd solidity-token
npm install
```



## Configuration

Create a `.env` file in the root directory based on the provided `.env.example`.

```bash
cp .env.example .env
```



Update the `.env` file with your private key and desired network configurations.

## Local Development

Start a local Hardhat node:

```bash
npx hardhat node
```



Deploy the contract to the local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```



## Compilation & Testing

To compile the contracts:

```bash
npx hardhat compile
```



To run tests:

```bash
npx hardhat test
```



## Deployment

To deploy the contract to a testnet (e.g., Sepolia):

```bash
npx hardhat run scripts/deploy.js --network sepolia
```



Ensure your `.env` file contains the appropriate API keys and private key for deployment.

## Contract Architecture

The contract is located in `contracts/Token.sol` and includes:

* ERC‑20 standard functions
* A transfer fee mechanism where a percentage of each transfer is sent to the deployer's address
* Configurable fee percentage set during deployment

## Usage

After deployment, you can interact with the contract using Hardhat scripts or through a frontend interface. Key functions include:

* `transfer`: Transfer tokens to another address, applying the transfer fee.
* `balanceOf`: Check the token balance of an address.
* `totalSupply`: View the total supply of tokens.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
