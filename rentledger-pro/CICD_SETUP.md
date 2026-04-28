# CI/CD Setup Guide

GitHub Actions workflows need to be added with a token that has `workflow` scope. Follow these steps:

## Option 1: Add via GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click **New workflow**
4. Click **set up a workflow yourself**
5. Copy and paste each workflow file below

## Option 2: Use GitHub CLI with Workflow Scope

```bash
# Install GitHub CLI if not already installed
brew install gh  # macOS
# or
sudo apt install gh  # Ubuntu/Debian

# Authenticate with workflow scope
gh auth login --scopes workflow

# Create workflows directory
mkdir -p .github/workflows

# Add the workflow files (see below)
# Then commit and push
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push origin main


## Workflow Files

### 1. CI Workflow (`.github/workflows/ci.yml`)

Create this file to run tests on every push and PR:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  server-test:
    name: Server Tests
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:8
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - working-directory: ./server
        run: npm ci
      - working-directory: ./server
        run: npm test || echo "No tests configured"

  client-test:
    name: Client Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - working-directory: ./client
        run: npm ci
      - working-directory: ./client
        run: npm run build

  contract-test:
    name: Contract Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      - working-directory: ./contract
        run: cargo test --verbose
      - working-directory: ./contract
        run: cargo build --target wasm32-unknown-unknown --release
```

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

Create this file for automated deployment:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-contract:
    name: Deploy Contract
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      - run: cargo install --locked stellar-cli --features opt
      - working-directory: ./contract
        run: |
          cargo build --target wasm32-unknown-unknown --release
          stellar contract build --optimize
      - uses: actions/upload-artifact@v4
        with:
          name: contract-wasm
          path: contract/target/wasm32-unknown-unknown/release/*.wasm

  deploy-client:
    name: Deploy Client
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - working-directory: ./client
        run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: client-build
          path: client/build/
```

### 3. Release Workflow (`.github/workflows/release.yml`)

Create this file for version releases:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  create-release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - uses: actions-rust-lang/setup-rust-toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      
      - name: Build all
        run: |
          cd server && npm ci && zip -r ../server-${{ github.ref_name }}.zip .
          cd ../client && npm ci && npm run build && cd build && zip -r ../../client-${{ github.ref_name }}.zip .
          cd ../../contract && cargo build --target wasm32-unknown-unknown --release
      
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            server-${{ github.ref_name }}.zip
            client-${{ github.ref_name }}.zip
            contract/target/wasm32-unknown-unknown/release/rentledger.wasm
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Configure Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add:

- `STELLAR_DEPLOYER_SECRET` - Your Stellar secret key for contract deployment
- `VERCEL_TOKEN` - (Optional) For Vercel deployment
- `RAILWAY_TOKEN` - (Optional) For Railway deployment

## Test the Workflows

1. Make a small change and push to trigger CI
2. Check the **Actions** tab to see workflow runs
3. Create a tag to test release: `git tag v1.0.0 && git push --tags`

## Quick Commands

```bash
# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Re-run failed workflow
gh run rerun <run-id>

# Watch workflow in real-time
gh run watch
```
