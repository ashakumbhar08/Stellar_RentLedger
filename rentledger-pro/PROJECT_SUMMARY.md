# RentLedger Pro - Project Summary

## 🎯 Overview
Blockchain-powered rent payment and digital receipt platform built on Stellar, enabling tenants and landlords to create verifiable, tamper-proof payment records.

## 📊 Project Status
- ✅ Smart Contract: Deployed to Stellar Testnet
- ✅ Backend API: Built with Node.js + Express + MongoDB
- ✅ Frontend: Built with React + Freighter Wallet integration
- ✅ CI/CD: Docker + GitHub Actions workflows ready
- ✅ Documentation: Comprehensive deployment guides

## 🏗️ Architecture

### Smart Contract (Rust/Soroban)
- **Location**: `contract/`
- **Language**: Rust
- **Platform**: Stellar Soroban
- **Contract ID**: `CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT`
- **Network**: Testnet
- **Size**: 11.8 KB (optimized WASM)

**Key Functions**:
- `register_property` - Landlord creates property listing
- `record_payment` - Tenant records rent payment receipt
- `deactivate_property` - Landlord deactivates listing
- Read functions for properties, payments, and indexes

### Backend API (Node.js)
- **Location**: `server/`
- **Stack**: Express + MongoDB + Stellar SDK
- **Port**: 5001
- **Database**: MongoDB

**Endpoints**:
- `/api/properties` - Property management
- `/api/payments` - Payment recording and verification
- `/api/receipts` - Receipt retrieval
- `/api/health` - Health check

### Frontend (React)
- **Location**: `client/`
- **Stack**: React + React Router + Freighter API
- **Port**: 3000

**Pages**:
- Home - Landing page with features
- Dashboard - Landlord/tenant management
- PayPage - Tenant payment interface
- History - Payment history viewer

**Key Features**:
- Freighter wallet integration
- Real-time Stellar balance display
- Shareable payment links (UUID-based)
- Blockchain receipt generation
- Stellar Explorer integration

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
docker-compose up -d
```
Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

### Using Makefile
```bash
make install    # Install all dependencies
make dev        # Start development servers
make test       # Run all tests
make build      # Build for production
```

### Manual Setup
```bash
# Server
cd server && npm install && npm run dev

# Client (new terminal)
cd client && npm install && npm start

# Contract
cd contract && cargo test
```

## 📦 Deployment

### Docker Deployment
- Multi-stage builds for optimized images
- Health checks configured
- docker-compose.yml for orchestration

### Cloud Platforms
- **Vercel**: Client deployment (recommended)
- **Railway/Heroku**: Server deployment
- **MongoDB Atlas**: Database hosting

### CI/CD Pipeline
- **CI**: Automated testing on push/PR
- **Deploy**: Automated deployment to testnet
- **Release**: Version tagging with artifacts
- **Contract Upgrade**: Manual upgrade workflow

See `DEPLOYMENT.md` for detailed instructions.

## 🔐 Security Features
- Freighter wallet authentication
- On-chain transaction verification
- Landlord-only property management
- Tenant-only payment recording
- Immutable blockchain receipts

## 📝 Key Files

```
rentledger-pro/
├── contract/               # Rust smart contract
│   ├── src/lib.rs         # Contract implementation
│   └── Cargo.toml         # Rust dependencies
├── server/                # Node.js backend
│   ├── index.js           # Express server
│   ├── routes/            # API routes
│   ├── models/            # MongoDB models
│   └── utils/stellar.js   # Stellar integration
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Wallet context
│   │   └── utils/         # API & Stellar utils
│   └── public/
├── docker-compose.yml     # Docker orchestration
├── Makefile              # Common tasks
├── DEPLOYMENT.md         # Deployment guide
├── CICD_SETUP.md        # CI/CD setup guide
└── README.md            # Main documentation
```

## 🧪 Testing

### Contract Tests
```bash
cd contract && cargo test
```
- ✅ Property registration
- ✅ Payment recording
- ✅ Property deactivation
- ✅ Index tracking

### API Tests
```bash
cd server && npm test
```
(Tests to be implemented)

### Client Tests
```bash
cd client && npm test
```
(Tests to be implemented)

## 🔗 Important Links

- **Repository**: https://github.com/ashakumbhar08/Stellar_RentLedger
- **Contract Explorer**: https://stellar.expert/explorer/testnet/contract/CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT
- **Stellar Testnet**: https://horizon-testnet.stellar.org
- **Freighter Wallet**: https://www.freighter.app/
- **Friendbot (Testnet Funding)**: https://friendbot.stellar.org

## 📈 Future Enhancements

- [ ] Add comprehensive test suites
- [ ] Implement dispute resolution mechanism
- [ ] Add multi-currency support
- [ ] Create landlord/tenant dashboards with analytics
- [ ] Add email notifications
- [ ] Implement recurring payment automation
- [ ] Add mobile app (React Native)
- [ ] Deploy to Stellar Mainnet
- [ ] Add KYC/AML compliance features
- [ ] Integrate with property management systems

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

- Developer: Asha Kumbhar
- GitHub: @ashakumbhar08
- Email: ashakumbhar2006@gmail.com

## 🙏 Acknowledgments

- Stellar Development Foundation
- Soroban smart contract platform
- Freighter wallet team
- Open source community
