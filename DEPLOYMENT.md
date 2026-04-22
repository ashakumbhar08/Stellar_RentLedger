# Deployment Guide

## CI/CD Pipeline Overview

The project uses GitHub Actions for automated testing and deployment:

### Workflows

1. **CI (Continuous Integration)** - Runs on every push/PR
   - Server tests with MongoDB
   - Client tests and build
   - Smart contract tests and WASM build
   - Security audits

2. **Deploy** - Runs on push to `main`
   - Deploys smart contract to Stellar testnet
   - Builds and deploys client
   - Deploys server API

3. **Release** - Runs on version tags (`v*.*.*`)
   - Creates GitHub release with artifacts
   - Packages server, client, and contract WASM

4. **Contract Upgrade** - Manual workflow
   - Upgrades deployed smart contract
   - Requires confirmation input

## Setup GitHub Secrets

Configure these secrets in your GitHub repository settings:

```
STELLAR_DEPLOYER_SECRET    # Stellar secret key for contract deployment
VERCEL_TOKEN              # (Optional) Vercel deployment token
VERCEL_ORG_ID             # (Optional) Vercel organization ID
VERCEL_PROJECT_ID         # (Optional) Vercel project ID
RAILWAY_TOKEN             # (Optional) Railway deployment token
```

## Docker Deployment

### Local Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

Services will be available at:
- Client: http://localhost:3000
- Server API: http://localhost:5001
- MongoDB: localhost:27017

### Production Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy to your container registry
docker tag rentledger-server:latest your-registry/rentledger-server:latest
docker push your-registry/rentledger-server:latest

docker tag rentledger-client:latest your-registry/rentledger-client:latest
docker push your-registry/rentledger-client:latest
```

## Manual Deployment

### 1. Deploy Smart Contract

```bash
cd contract

# Build optimized WASM
cargo build --target wasm32-unknown-unknown --release
stellar contract build --optimize

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/rentledger.optimized.wasm \
  --source deployer \
  --network testnet

# Save the contract ID
echo "CONTRACT_ID=<your-contract-id>" > .env
```

### 2. Deploy Server

#### Option A: Traditional VPS (Ubuntu/Debian)

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Clone and setup
git clone https://github.com/ashakumbhar08/Stellar_RentLedger.git
cd Stellar_RentLedger/server
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Install PM2 for process management
sudo npm install -g pm2

# Start server
pm2 start index.js --name rentledger-server
pm2 save
pm2 startup
```

#### Option B: Railway

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy from `server` directory

#### Option C: Heroku

```bash
cd server
heroku create rentledger-api
heroku addons:create mongolab:sandbox
heroku config:set STELLAR_NETWORK=testnet
heroku config:set STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
git subtree push --prefix server heroku main
```

### 3. Deploy Client

#### Option A: Vercel (Recommended)

```bash
cd client
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel dashboard.

#### Option B: Netlify

```bash
cd client
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### Option C: Static hosting (Nginx)

```bash
cd client
npm run build

# Copy build to web server
scp -r build/* user@server:/var/www/rentledger/

# Nginx config
sudo nano /etc/nginx/sites-available/rentledger
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/rentledger;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
    }
}
```

## Environment Variables

### Server (.env)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/rentledger
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Client (build-time)
```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_CONTRACT_ID=CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT
REACT_APP_NETWORK=testnet
```

## Monitoring & Logs

### PM2 (Server)
```bash
pm2 logs rentledger-server
pm2 monit
pm2 restart rentledger-server
```

### Docker
```bash
docker-compose logs -f server
docker-compose logs -f client
docker stats
```

### Health Checks
- Server: `curl http://localhost:5001/api/health`
- Client: `curl http://localhost:3000`

## Upgrading Smart Contract

```bash
# Build new version
cd contract
cargo build --target wasm32-unknown-unknown --release
stellar contract build --optimize

# Install new WASM (gets new hash)
stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/rentledger.optimized.wasm \
  --source deployer \
  --network testnet

# Update contract code (if using upgradeable pattern)
# Or deploy new instance and update client config
```

## Rollback Procedure

### Server
```bash
# PM2
pm2 restart rentledger-server --update-env

# Docker
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

### Client
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

### Contract
Redeploy previous WASM version or revert to previous contract ID in client config.

## Production Checklist

- [ ] Update all environment variables
- [ ] Configure MongoDB with authentication
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up domain DNS records
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure backups for MongoDB
- [ ] Test Freighter wallet connection
- [ ] Verify contract deployment on mainnet
- [ ] Update contract ID in client
- [ ] Test end-to-end payment flow
- [ ] Set up error tracking
- [ ] Configure CDN for static assets
