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

```bash
icrc2_token_canister → # Custom ICP token canister for handling fungible token operations (ICRC-2 standard).

icp_ledger_canister → # Official ICP ledger canister to manage ICP transfers and balances.

internet_identity → # Authentication canister for login with Internet Identity.

nft_backend → # Motoko backend canister for NFT logic (minting, managing) & game interactions.

nft_frontend → # Static asset canister serving the NFT dApp frontend
```

### `package.json` (root)

- Contains **common dependencies** shared across all parts of the project.

### `mops.toml`

- Used to **manage Motoko dependencies** for building and deploying ICP canisters.

## Usage Guide

### 🔹 Project Setup

<details>

<summary> Follow the steps below to run the project locally on ICP network:</summary>

```bash

# clone repository
git clone https://github.com/BeGods/ICP-HACKATHON.git
cd ICP-HACKATHON

# stop any existing local IC replicas
dfx stop

# start a fresh local replica
dfx start --clean --background

# install mokoto dependencies
mops install

# install npm dependencies
npm i

# run the script to deploy the ICP token canister (includes init args)
./scripts/icp-token.sh

# run the script to deploy the ICP ledger canister (includes init args)
./scripts/icp-ledgers.sh

# deploy internet identity locally
dfx deploy internet_identity

# deploy frontend (also deploys nft_backend)
dfx deploy nft_frontend

# to re-delpoy the canister after any change in directoyr
dfx deploy <canister-name>  # eg. dfx deploy nft_frontend

```

</details>

<details>

<summary> After deploying your app, you'll get URLs for both the frontend and backend canisters. You can use these URLs in your local browsers to test your application locally.

> Users can log in using **Plug**, **Stoic Wallet**, or **Internet Identity** (recommended for local test).

</summary>

```bash

# Expected Output

Deployed canisters.
URLs:
Frontend canister via browser:
nft_frontend: - http://<frontend-canister-id>.localhost:4943/ (Recommended) - http://127.0.0.1:4943/?canisterId=<frontend-canister-id> (Legacy)
Backend canister via Candid interface:
icp_ledger_canister: http://127.0.0.1:4943/?canisterId=<icp-ledger-canister-id>
icrc2_token_canister: http://127.0.0.1:4943/?canisterId=<icp-token-canister-id>
internet_identity: http://127.0.0.1:4943/?canisterId=<canister-id>id=<ii-canister-id>
nft_backend: http://127.0.0.1:4943/?canisterId=<backend-canister-id>&id=<canister-id>

```

</details>

### 🔹 NFT Marketplace

<details>

<summary> To access the admin panel and add NFT collections, navigate to:

To log in as an admin and perform administrative actions, you must first whitelist your wallet's **Principal** in the list of canister controllers. Use the following command to do so:

</summary>

```bash

# add principal of your wallet to canister controllers
dfx canister update-settings nft_backend --add-controller <principal_id>

# check canisters settings
dfx canister status nft_backend

```

</details>

<details>

<summary> To mint NFT on client side you need to add some ICP tokens to you wallet principal from local ledger canister: 
</summary>

```bash

# get account_id for wallet principal
dfx ledger account-id --of-principal <principal_id>

# check canisters settings
dfx ledger transfer --amount <amount> --memo 0 <account_id>
# eg. dfx ledger transfer --amount 10 --memo 0 <account_id>

# confirm wallet balance
dfx ledger balance <account_id>

```

</details>

> Once NFT collections are added, they will be reflected at `http://<frontend-canister-id>.localhost:4943/`. Users can connect their wallet and mint the NFTs.

### 🔹 Game Launcher

<details>

<summary> Install packages for frontend and backend: 
</summary>

```bash

# install backend packages
cd src/game/backend
npm i
npm run dev

# open new terminal

# install frontend packages
cd src/game/frontend
npm i
npm run dev

```

</details>

> **Backend Requirement**: Install MongoDB on your system.

> **Environment Setup**: Configure environment variables (see .env.example in each folder for reference).

## ICP Integration

### 1. Authentication & Identity

- Integrated **`Internet Identity`**, **`Stoic`**, and **`Plug`** wallets for secure, decentralized login and user verification.

### 2. NFT & Asset Storage

- Game assets and NFTs are stored on the **ICP network** using decentralized storage for permanence and reliability.

### 3. NFT Minting & Management

- Uses **`EXT-based token standards`** for minting, tracking ownership, and managing NFTs fully on-chain.

### 4. ICP Deployment

- Frontend and backend of the **NFT Booster system** are deployed as **ICP canisters**, enabling a fully decentralized stack.

### 5. Game Quest Packets

- Integrated NFT packet minting within the game launcher — players mint NFT packets upon completing quests, with quest completion and minting **records maintained on-chain**.

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
- ▶️ [Watch ICP Pitch + Demo](https://www.youtube.com/watch?v=49O1Ha0cXic)
- 📄 [Pitch Deck & Tokenomics](https://drive.google.com/drive/folders/1k2VxC3KxC9VDfZ_hym7dy3RtVzUG5T1A?usp=sharing)
- 🌍 [Official Website](https://begods.games/) | 🐙 [GitHub](https://github.com/BeGods)
- 🐦 [X (formerly Twitter)](https://x.com/BattleofGods_io)
