# Web3 Real Estate DApp (Polygon Amoy)

This project is a Web3 real estate DApp built with Next.js and deployed to the Polygon PoS Amoy testnet. [web:2][web:1] It lets users list properties, view on‑chain data, and interact with smart contracts in a low‑cost test environment that closely mirrors Polygon mainnet behavior. [web:2][web:4]

## Project Overview

- Frontend built with Next.js (App Router) for a modern, React‑based UX. [web:36]
- Smart contracts deployed to Polygon Amoy, Polygon’s Sepolia‑anchored PoS testnet. [web:1][web:4]
- Wallet connection and on‑chain interactions handled via standard EVM tooling (e.g., MetaMask) configured for Amoy. [web:2][web:32]
- Designed so network configuration, contract addresses, and environment variables can be updated as Polygon’s testnet infrastructure evolves. [web:1][web:5]

## Why Polygon Amoy?

Polygon Amoy replaces the older Mumbai testnet and is now the recommended PoS testnet for developers. [web:1][web:14] It uses Ethereum Sepolia as the root chain and provides:

- Chain ID `80002` with POL as the native gas token. [web:2][web:35]
- Fast block times and low, test‑only gas fees, ideal for rapid dApp iteration. [web:2]
- Full tooling support, including block explorers (e.g., Amoy PolygonScan) and multiple public RPC endpoints. [web:2][web:11][web:5]

Because testnets change over time, this project isolates network settings so they can be updated without altering application logic.

## Constantly Updated Parts

Several parts of this project are intentionally configurable and may need regular updates:

### Network configuration

- RPC endpoint URL for Polygon Amoy (for example, `https://rpc-amoy.polygon.technology/` or other providers). [web:1][web:35]
- Chain ID and currency metadata used by wallets. [web:2][web:35]

### Contract addresses

- Deployed real estate contract address on Amoy.
- Any auxiliary contracts (e.g., token contracts, marketplace modules).

These are stored in environment variables or a dedicated config file so you can redeploy and swap addresses easily.

### Faucet and funding references

- Links to working Amoy POL faucets (e.g., Alchemy, Polygon faucet, and other listed options) may change and should be checked periodically. [web:8][web:13][web:16][web:4]

### Explorer links

- URLs to the Amoy block explorer (e.g., PolygonScan for Amoy) used in the UI or documentation. [web:11]

## Getting Started

Install dependencies and start the local dev server:

npm install
npm run dev

or
yarn install && yarn dev

or
pnpm install && pnpm dev

or
bun install && bun dev

Then:

1. Open http://localhost:3000 in your browser. [web:36]
2. Configure your wallet (e.g., MetaMask) for Polygon Amoy using the published network details (RPC URL, chain ID 80002, POL as native token). [web:2][web:32][web:35]
3. Fund your wallet with test POL from an Amoy faucet so you can interact with the contracts. [web:8][web:13][web:16][web:4]

## Development Notes

- The main UI is defined in `app/page.tsx`, and updates trigger automatic hot‑reloading in development. [web:36]
- Fonts are optimized using `next/font` with the Geist family from Vercel for consistent typography. [web:36]
- Environment‑specific values (RPC URLs, contract addresses, explorer base URLs) are loaded via `.env` and should be set per‑environment (local, test, production). [web:22][web:31]

## Deployment

The frontend can be deployed to any platform that supports Next.js, such as Vercel. [web:36] The only requirements are:

- Set environment variables for Amoy RPC URLs and contract addresses in the hosting dashboard. [web:1][web:5]
- Ensure the deployed URL matches any configured redirect or callback URLs used by wallets or third‑party services. [web:22]

Once deployed, users with Amoy‑funded wallets can interact with the DApp using test POL, safely trying out all features before any mainnet deployment. [web:2][web:4]
