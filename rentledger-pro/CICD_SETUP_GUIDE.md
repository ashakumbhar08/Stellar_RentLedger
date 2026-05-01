# 🚀 CI/CD Pipeline Setup Guide

## Overview

This project uses **GitHub Actions** for continuous integration and deployment with two main workflows:

1. **CI Pipeline** (`ci.yml`) - Runs on every push and PR
2. **Deploy Pipeline** (`deploy.yml`) - Deploys to production on push to main

---

## 📋 Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- ✅ GitHub repository with admin access
- ✅ Vercel account (for frontend deployment)
- ✅ Docker Hub account (optional, for backend deployment)
- ✅ Stellar account (optional, for contract deployment)

---

## 🔧 Setup Instructions

### Step 1: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Required Secrets for Frontend Deployment:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | 1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)<br>2. Click "Create Token"<br>3. Copy the token |
| `VERCEL_ORG_ID` | Your Vercel organization ID | 1. Run `vercel link` in your project<br>2. Check `.vercel/project.json`<br>3. Copy `orgId` value |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | 1. Run `vercel link` in your project<br>2. Check `.vercel/project.json`<br>3. Copy `projectId` value |

#### Optional Secrets for Docker Deployment:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DOCKER_USERNAME` | Docker Hub username | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token | 1. Go to [Docker Hub Security](https://hub.docker.com/settings/security)<br>2. Create new access token |

#### Optional Secrets for Contract Deployment:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `STELLAR_SECRET_KEY` | Stellar account secret key | Your Stellar testnet secret key (starts with S) |

---

### Step 2: Get Vercel Credentials

#### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd client
vercel link

# Check the generated file
cat .vercel/project.json
```

The output will look like:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

#### Method 2: Using Vercel Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Find **Project ID** in the URL or settings
5. Find **Team ID** in your team settings

---

### Step 3: Configure Workflows

#### Enable/Disable Optional Jobs

Edit `.github/workflows/deploy.yml`:

**Enable Docker Deployment:**
```yaml
deploy-backend-docker:
  if: true  # Change from false to true
```

**Enable Contract Deployment:**
```yaml
deploy-contract:
  if: true  # Change from false to true
```

---

### Step 4: Verify Setup

#### Test CI Pipeline

```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "test: trigger CI pipeline"
git push origin main
```

#### Check Workflow Status

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "CI Pipeline" running
4. Wait for all checks to pass ✅

---

## 📊 Workflow Details

### CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**

1. **Frontend CI**
   - Install dependencies
   - Run linter (if exists)
   - Run tests
   - Build React app
   - Upload build artifacts

2. **Backend CI**
   - Install dependencies
   - Run linter (if exists)
   - Run tests
   - Validate JavaScript syntax
   - Check all files for errors

3. **Contract CI**
   - Setup Rust toolchain
   - Run code formatting check
   - Run Clippy linter
   - Run contract tests
   - Build WASM (debug & release)
   - Upload WASM artifacts

4. **Security Audit**
   - Audit npm dependencies (frontend & backend)
   - Audit Rust dependencies (contract)

5. **CI Success**
   - Final status check
   - Summary of all jobs

**Expected Duration:** 5-8 minutes

---

### Deploy Pipeline (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger (workflow_dispatch)

**Jobs:**

1. **Deploy Frontend**
   - Install Vercel CLI
   - Pull Vercel environment
   - Build project
   - Deploy to Vercel production
   - Comment deployment URL on PR

2. **Deploy Backend (Optional)**
   - Build Docker image
   - Push to Docker Hub
   - Tag with commit SHA

3. **Deploy Contract (Optional)**
   - Build optimized WASM
   - Deploy to Stellar Testnet

4. **Deploy Success**
   - Final status check
   - Create deployment report

**Expected Duration:** 3-5 minutes

---

## 🎯 Best Practices

### 1. Branch Protection Rules

Set up branch protection for `main`:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Select: `Frontend CI`, `Backend CI`, `Contract CI`

### 2. Environment Variables

For sensitive data, use GitHub Secrets instead of hardcoding:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

### 3. Caching Strategy

The workflows use caching for:
- ✅ npm dependencies (`node_modules`)
- ✅ Cargo dependencies (`~/.cargo`)
- ✅ Docker layers

This reduces build time by 50-70%.

### 4. Manual Deployment

To manually trigger deployment:

1. Go to **Actions** tab
2. Select "Deploy Pipeline"
3. Click **Run workflow**
4. Select branch and click **Run workflow**

---

## 🐛 Troubleshooting

### Issue: "VERCEL_TOKEN not found"

**Solution:**
1. Verify secret name is exactly `VERCEL_TOKEN` (case-sensitive)
2. Check secret is added at repository level, not environment level
3. Re-create the secret if needed

### Issue: "npm ci failed"

**Solution:**
1. Ensure `package-lock.json` is committed
2. Run `npm install` locally to regenerate lock file
3. Commit and push the updated lock file

### Issue: "Cargo build failed"

**Solution:**
1. Check Rust version compatibility
2. Run `cargo update` locally
3. Ensure `Cargo.lock` is committed

### Issue: "Docker push failed"

**Solution:**
1. Verify Docker Hub credentials
2. Check repository name matches your Docker Hub username
3. Ensure Docker Hub repository exists

### Issue: "Vercel deployment failed"

**Solution:**
1. Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
2. Verify Vercel token has deployment permissions
3. Run `vercel link` locally to re-link project

---

## 📈 Monitoring

### View Workflow Runs

- **All workflows:** `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
- **Specific workflow:** Click on workflow name in Actions tab
- **Specific run:** Click on individual run to see logs

### Badges

Add status badges to your README:

```markdown
[![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Deploy Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
```

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Push to main / PR                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │      CI Pipeline Triggered     │
         └───────────────┬───────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│  Frontend CI    │            │   Backend CI    │
│  - Install deps │            │  - Install deps │
│  - Run tests    │            │  - Run tests    │
│  - Build        │            │  - Validate     │
└────────┬────────┘            └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   Contract CI   │
                │  - Run tests    │
                │  - Build WASM   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Security Audit  │
                │  - npm audit    │
                │  - cargo audit  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   CI Success    │
                │  ✅ All passed  │
                └────────┬────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   Deploy Pipeline Triggered    │
         │      (only on push to main)    │
         └───────────────┬───────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Deploy Frontend │
                │  → Vercel       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Deploy Success  │
                │  🚀 Live!       │
                └─────────────────┘
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Rust GitHub Actions](https://github.com/actions-rust-lang/setup-rust-toolchain)

---

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review workflow logs in GitHub Actions
3. Open an issue in the repository
4. Contact the development team

---

## ✅ Checklist

Before pushing to production:

- [ ] All secrets added to GitHub
- [ ] Vercel project linked
- [ ] CI pipeline passes locally
- [ ] Branch protection rules enabled
- [ ] Status badges added to README
- [ ] Team notified of deployment process
- [ ] Rollback plan documented
- [ ] Monitoring set up

---

**Last Updated:** May 2026  
**Maintained by:** RentLedger Pro Team
