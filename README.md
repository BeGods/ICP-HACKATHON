# BEGODS Games

BeGods is the ultimate mythological universe — the largest mythoverse ever created. It brings together over 18 mythologies and more than 999 gods that stays true to ancient source material, all illustrated by real human artists.

Blending physical and digital play, BeGods offers a groundbreaking phygital experience — a board game enhanced by Web2, Web3, and augmented reality.

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Usage Guide](#usage-guide)
4. [ICP Integration](#icp-integration)
5. [Future Scope](#icp-integration)
6. [Important Links](#important-links)

## Overview

This mono repository contains the **BeGods Game Launcher** and the **NFT Booster System**, both under active development with plans to move fully on-chain using the Internet Computer Protocol (ICP).

The **BeGods Game Launcher** includes 3 games — currently, **Game I** and **Game II** are integrated. These games are currently off-chain but support wallet connections to enable future on-chain interactions. The repository includes both the frontend and backend code for the games.

The **NFT Booster System** allows users to mint and upgrade NFTs. It also includes an admin panel to manage NFT logic. This system can already be tested locally in the ICP playground on the ICP testnet and serves as our first fully on-chain feature.

> **Note:** This mono repo was made by merging the separate game frontend, game backend, and NFT system **private** repositories, which were originally hosted under our [GitHub organization](https://github.com/BeGods).

## System Architecture

```
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── dfx.json                   # ICP canister configuration
├── mops.toml                  # ICP Motoko packages
├── package.json               # Root-level dependencies (used across the project)
├── README.md
├── scripts/                   # scripts to deploy project
│   ├── setup.sh
│   └── icp-ledgers.sh
├── src/
│   ├── declarations           # Auto generated files for ICP canisters
│   ├── game/                  # Game I and II ( OFF CHAIN )
│   │   ├── frontend/          # React + Vite app
│   │   └── backend/           # Node.js backend with MongoDB & Redis
│   └── nft/                   # NFT Booster System ( ON CHAIN )
│       ├── nft_frontend/      # React + Vite app
│       └── nft_backend/       # Motoko backend fully on-chain (ICP)
```

### `src/game/`

- Includes the code for **Game I** and **Game II** , organized with reusable components for better structure and maintainability
- `frontend/`: Built with **React + Vite** using reusable components.
- `backend/`: Built with **Node.js**, uses **MongoDB** and **Redis** for data storage and caching.

### `src/nft/`

- Contains code of **NFT Booster System**.
- `nft_frontend/`: **React + Vite** frontend with both **admin panel** and **client panel**.
- `nft_backend/`: Built using **Motoko**, and runs fully **on-chain** with ICP.
- `nft_backend/main.mo`: Contains all controller functions for both user and admin NFT operations.

### `src/declarations/`

- Contains **auto-generated files** by `dfx` for interacting with ICP canisters from the frontend.

### `dfx.json`

- Configuration file for **managing all ICP canister settings** (currently used only for the NFT system).

### `package.json` (root)

- Contains **common dependencies** shared across all parts of the project.

### `mops.toml`

- Used to **manage Motoko dependencies** for building and deploying ICP canisters.

## Usage Guide

Follow the steps below to run the project locally on ICP network:

```bash

# clone repository
git clone https://github.com/BeGods/ICP-HACKATHON.git
cd begods-games

# install necessary packages
npm install

# sets up and deploys the ICP ledger canister with the necessary initialization parameters
./scripts/icp-ledgers.sh

# deploy on ICP
dfx deploy

```

To log in as an admin and perform administrative actions, you must first whitelist your wallet's `Principal` in the controllers. Use the command below to do so:

```bash

# add principal of your wallet to canister controllers
dfx canister update-settings <canister_name> --add-controller <principal_id>

# check canisters settings
dfx canister info <canister_name>

```

## ICP Integration

### 1. Authentication & Identity

- Integrated **`Internet Identity`**, **`Stoic`**, and **`Plug`** wallets for secure, decentralized login and user verification.

### 2. NFT & Asset Storage

- Game assets and NFTs are stored on the **ICP network** using decentralized storage for permanence and reliability.

### 3. NFT Minting & Management

- Uses **`EXT-based token standards`** for minting, tracking ownership, and managing NFTs fully on-chain.

### 4. ICP Deployment

- Frontend and backend of the **NFT Booster system** are deployed as **ICP canisters**, enabling a fully decentralized stack.

### 5. Cycle Management

- Utilizes `ExperimentalCycles` to manage computation cycles and ensure efficient resource usage.

### 6. Principal-Based Access

- Uses **role-based access control** for users and admins based on their ICP wallet `Principal`.

## Future Scope

### 1. Seasonal NFTs

- NFTs will be tied to specific **seasons**, each with custom rules like start/end dates and rarity eligibility.
- Supports seamless transitions between seasons (e.g., _Season 1 → Season 2_) with progressive rarity adjustments.

### 2. NFT Burning System

- Users can **burn 3 low-rarity NFTs** to mint **1 higher-rarity NFT**, encouraging crafting and rarity upgrading.

### 3. Game Hosting on ICP

- APIs with core mechanics and game-state rules will be **deployed as canisters** for greater transparency and immutability.

### 4. AI-Powered Interaction

- Personalized interactions and game mechanics will be powered by our **AI models**, deployed directly on the **ICP**.

## Important Links

- 🎮 [Play on Line](https://www.dappportal.io/dapps/N67d3fe6a2da7d7180c987b0f) | [Play on Telegram](https://t.me/BeGods_bot/games)
- 📄 [Pitch Deck & Tokenomics](https://drive.google.com/drive/folders/1k2VxC3KxC9VDfZ_hym7dy3RtVzUG5T1A?usp=sharing)
- 🌍 [Official Website](https://begods.games/) | 🐙 [GitHub](https://github.com/BeGods)
- 🐦 [X (formerly Twitter)](https://x.com/BattleofGods_io)
