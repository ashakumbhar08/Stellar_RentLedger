# RentLedger Pro

Blockchain-powered rent payment and digital receipt platform built on Stellar.

## Stack
- **Frontend**: React + Freighter Wallet
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Blockchain**: Stellar (Testnet)

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally
- [Freighter browser extension](https://www.freighter.app/) installed

### Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm start
```

## Features
- **Landlord**: Create property profiles, get shareable payment links
- **Tenant**: Pay rent via Freighter wallet (XLM), get instant blockchain receipts
- **History**: Full payment history for both landlords and tenants
- **Receipts**: Verifiable on-chain receipts linked to Stellar Explorer

## Freighter Wallet Setup
1. Install [Freighter](https://www.freighter.app/) browser extension
2. Create or import a Stellar wallet
3. Switch to **Testnet** in Freighter settings
4. Fund your testnet wallet at [Stellar Friendbot](https://friendbot.stellar.org/)
