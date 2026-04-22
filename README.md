# RentLedger Pro

[![CI](https://github.com/ashakumbhar08/Stellar_RentLedger/actions/workflows/ci.yml/badge.svg)](https://github.com/ashakumbhar08/Stellar_RentLedger/actions/workflows/ci.yml)
[![Deploy](https://github.com/ashakumbhar08/Stellar_RentLedger/actions/workflows/deploy.yml/badge.svg)](https://github.com/ashakumbhar08/Stellar_RentLedger/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

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

## Deployed Smart Contract (Testnet)

| | |
|---|---|
| Contract ID | `CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT` |
| Network | Stellar Testnet |
| Explorer | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT) |

### Contract Functions
| Function | Description |
|---|---|
| `register_property` | Landlord registers a property, returns property ID |
| `deactivate_property` | Landlord deactivates a property |
| `record_payment` | Tenant records a rent payment receipt on-chain |
| `get_property` | Fetch property details by ID |
| `get_payment` | Fetch payment receipt by ID |
| `get_landlord_properties` | Get all property IDs for a landlord |
| `get_tenant_payments` | Get all payment IDs for a tenant |
| `get_property_payments` | Get all payment IDs for a property |
| `property_count` | Total properties registered |
| `payment_count` | Total payments recorded |


- **Landlord**: Create property profiles, get shareable payment links
- **Tenant**: Pay rent via Freighter wallet (XLM), get instant blockchain receipts
- **History**: Full payment history for both landlords and tenants
- **Receipts**: Verifiable on-chain receipts linked to Stellar Explorer

## Freighter Wallet Setup
1. Install [Freighter](https://www.freighter.app/) browser extension
2. Create or import a Stellar wallet
3. Switch to **Testnet** in Freighter settings
4. Fund your testnet wallet at [Stellar Friendbot](https://friendbot.stellar.org/)

## Development

### Quick Start with Docker
```bash
docker-compose up -d
```
Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- MongoDB: localhost:27017

### Manual Setup
See individual setup instructions above for server and client.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide including:
- CI/CD pipeline setup
- Docker deployment
- Cloud platform deployment (Vercel, Railway, Heroku)
- Smart contract upgrades
- Production checklist

## CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:
- **CI**: Runs tests on every push/PR (server, client, contract)
- **Deploy**: Automatically deploys to testnet on push to `main`
- **Release**: Creates releases with artifacts on version tags
- **Contract Upgrade**: Manual workflow for contract upgrades

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
