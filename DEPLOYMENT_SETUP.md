# 🚀 Deployment Pipeline Setup Guide

## Current Status

✅ **Phase 1 (SAFE MODE)** - Active  
- Deploy pipeline is GREEN (placeholder)
- Badge is working
- No actual deployment happening

⏳ **Phase 2 (PRODUCTION)** - Ready to activate  
- Production workflow file created
- Waiting for secrets configuration

---

## 📋 Quick Start

### Option 1: Keep Safe Mode (Current)
**Do nothing** - Your deploy badge is already green!

### Option 2: Activate Production Deployment

Follow these steps to enable real Vercel deployment:

---

## 🔐 Step 1: Get Vercel Credentials

### A. Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name: `GitHub Actions`
4. Scope: **Full Account**
5. Click **Create**
6. **Copy the token immediately** (you won't see it again!)

### B. Get Project IDs

```bash
# Navigate to client folder
cd client

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# View the generated IDs
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

---

## 🔧 Step 2: Add GitHub Secrets

1. Go to your repository: https://github.com/ashakumbhar08/Stellar_RentLedger
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these three secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VERCEL_TOKEN` | Your token from Step 1A | `abc123...` |
| `VERCEL_ORG_ID` | `orgId` from .vercel/project.json | `team_abc123` |
| `VERCEL_PROJECT_ID` | `projectId` from .vercel/project.json | `prj_def456` |

---

## 🎯 Step 3: Activate Production Workflow

### Method 1: Using Git Commands

```bash
# Remove placeholder workflow
rm .github/workflows/deploy.yml

# Activate production workflow
mv .github/workflows/deploy-production.yml.example .github/workflows/deploy.yml

# Commit and push
git add .github/workflows/
git commit -m "feat: activate production deployment workflow"
git push origin main
```

### Method 2: Manual (GitHub Web UI)

1. Delete `.github/workflows/deploy.yml`
2. Rename `.github/workflows/deploy-production.yml.example` to `deploy.yml`
3. Commit changes

---

## ✅ Step 4: Verify Deployment

1. Push triggers deployment automatically
2. Check Actions tab: https://github.com/ashakumbhar08/Stellar_RentLedger/actions
3. Wait for "Deploy Pipeline" to complete
4. Check deployment URL in workflow logs

---

## 🔍 Troubleshooting

### Issue: "VERCEL_TOKEN not found"

**Solution:**
- Verify secret name is exactly `VERCEL_TOKEN` (case-sensitive)
- Check secret is at repository level, not environment level
- Re-create the secret if needed

### Issue: "Project not found"

**Solution:**
- Run `vercel link` again in client folder
- Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` match `.vercel/project.json`
- Ensure project exists in Vercel dashboard

### Issue: "Build failed"

**Solution:**
- Test build locally: `cd client && npm run build`
- Check for missing dependencies
- Verify Node.js version compatibility

---

## 📊 Workflow Architecture

### Current (Safe Mode)
```
Push to main
    ↓
Deploy Pipeline
    ↓
Echo "Success"
    ↓
✅ Badge GREEN
```

### Production (After Activation)
```
Push to main
    ↓
CI Pipeline (must pass)
    ↓
Deploy Frontend
    ├─ Install Vercel CLI
    ├─ Pull environment
    ├─ Build project
    └─ Deploy to production
    ↓
✅ Live on Vercel
```

---

## 🎨 Customization Options

### Enable Backend Deployment

Edit `.github/workflows/deploy.yml`:

```yaml
deploy-backend:
  if: true  # Change from false to true
```

### Add Deployment Notifications

Add this step to the workflow:

```yaml
- name: Notify deployment
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"Deployed to production!"}'
```

### Deploy to Staging First

Add a staging job before production:

```yaml
deploy-staging:
  name: Deploy to Staging
  runs-on: ubuntu-latest
  needs: ci
  steps:
    - name: Deploy to staging
      run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Best Practices

1. ✅ **Test locally first** - Always test `vercel build` locally
2. ✅ **Use branch protection** - Require CI to pass before merge
3. ✅ **Monitor deployments** - Check Vercel dashboard regularly
4. ✅ **Rotate tokens** - Update Vercel token every 90 days
5. ✅ **Keep secrets secure** - Never commit secrets to repository

---

## 🔗 Useful Links

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)

---

## 📞 Need Help?

1. Check workflow logs in Actions tab
2. Review this guide's troubleshooting section
3. Test Vercel deployment locally first
4. Verify all secrets are correctly set

---

**Current Status:** Safe Mode Active ✅  
**Next Step:** Add secrets and activate production workflow  
**Estimated Time:** 10 minutes
