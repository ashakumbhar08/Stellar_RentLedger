# 🔐 GitHub Secrets Quick Setup

## Required Secrets

### For Vercel Deployment (Required)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link your project
cd client
vercel link

# 4. Get your credentials
cat .vercel/project.json
```

Add these secrets to GitHub:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | `your_vercel_token` | [Vercel Account Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_xxxxx` | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `prj_xxxxx` | `.vercel/project.json` → `projectId` |

---

## Optional Secrets

### For Docker Deployment (Optional)

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `DOCKER_USERNAME` | `your_dockerhub_username` | Your Docker Hub username |
| `DOCKER_PASSWORD` | `your_access_token` | [Docker Hub Tokens](https://hub.docker.com/settings/security) |

### For Contract Deployment (Optional)

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `STELLAR_SECRET_KEY` | `Sxxxxxxxxxxxxx` | Your Stellar testnet secret key |

---

## How to Add Secrets to GitHub

### Method 1: GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Enter **Name** and **Secret**
6. Click **Add secret**

### Method 2: GitHub CLI

```bash
# Install GitHub CLI
brew install gh  # macOS
# or
sudo apt install gh  # Linux

# Login
gh auth login

# Add secrets
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

---

## Verification

After adding secrets, verify they're set:

```bash
# List all secrets (values are hidden)
gh secret list
```

Expected output:
```
VERCEL_TOKEN        Updated 2024-XX-XX
VERCEL_ORG_ID       Updated 2024-XX-XX
VERCEL_PROJECT_ID   Updated 2024-XX-XX
```

---

## Getting Vercel Token

### Step-by-Step:

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Enter token name: `GitHub Actions`
4. Select scope: **Full Account**
5. Set expiration: **No Expiration** (or custom)
6. Click **Create Token**
7. **Copy the token immediately** (you won't see it again!)
8. Add to GitHub secrets as `VERCEL_TOKEN`

---

## Getting Vercel Project IDs

### Method 1: Using Vercel CLI

```bash
cd client
vercel link

# Follow the prompts:
# ? Set up and deploy "~/path/to/client"? [Y/n] y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] y
# ? What's the name of your existing project? rentledger-pro

# Check the generated file
cat .vercel/project.json
```

Output:
```json
{
  "orgId": "team_abc123xyz",
  "projectId": "prj_def456uvw"
}
```

### Method 2: From Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings**
4. **Project ID** is shown in the URL:
   ```
   https://vercel.com/your-team/your-project/settings
                      ^^^^^^^^^ (this is your org)
                                 ^^^^^^^^^^^^ (this is your project)
   ```

---

## Testing Secrets

Create a test workflow to verify secrets are working:

```yaml
name: Test Secrets
on: workflow_dispatch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check secrets
        run: |
          if [ -z "${{ secrets.VERCEL_TOKEN }}" ]; then
            echo "❌ VERCEL_TOKEN not set"
          else
            echo "✅ VERCEL_TOKEN is set"
          fi
          
          if [ -z "${{ secrets.VERCEL_ORG_ID }}" ]; then
            echo "❌ VERCEL_ORG_ID not set"
          else
            echo "✅ VERCEL_ORG_ID is set"
          fi
          
          if [ -z "${{ secrets.VERCEL_PROJECT_ID }}" ]; then
            echo "❌ VERCEL_PROJECT_ID not set"
          else
            echo "✅ VERCEL_PROJECT_ID is set"
          fi
```

---

## Security Best Practices

1. ✅ **Never commit secrets** to your repository
2. ✅ **Use repository secrets** for sensitive data
3. ✅ **Rotate tokens** regularly (every 90 days)
4. ✅ **Use environment-specific secrets** for staging/production
5. ✅ **Limit token permissions** to minimum required
6. ✅ **Monitor secret usage** in GitHub Actions logs
7. ✅ **Delete unused secrets** immediately

---

## Troubleshooting

### Secret not found

**Problem:** Workflow fails with "secret not found"

**Solution:**
1. Check secret name is **exactly** as specified (case-sensitive)
2. Verify secret is added at **repository level**, not environment level
3. Re-create the secret if needed

### Invalid Vercel token

**Problem:** Vercel deployment fails with authentication error

**Solution:**
1. Generate a new token from Vercel dashboard
2. Ensure token has **full account** scope
3. Update the `VERCEL_TOKEN` secret in GitHub

### Wrong project ID

**Problem:** Vercel deployment goes to wrong project

**Solution:**
1. Run `vercel link` again in your client folder
2. Select the correct project
3. Update `VERCEL_PROJECT_ID` with new value from `.vercel/project.json`

---

## Quick Commands Reference

```bash
# Vercel CLI
npm i -g vercel                    # Install Vercel CLI
vercel login                       # Login to Vercel
vercel link                        # Link project
vercel --version                   # Check version

# GitHub CLI
gh auth login                      # Login to GitHub
gh secret set SECRET_NAME          # Add secret
gh secret list                     # List secrets
gh secret remove SECRET_NAME       # Remove secret

# Check secrets in workflow
echo "Token length: ${#VERCEL_TOKEN}"  # Shows length without revealing value
```

---

## Need Help?

- 📖 [Vercel CLI Docs](https://vercel.com/docs/cli)
- 📖 [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- 📖 [GitHub CLI Docs](https://cli.github.com/manual/)

---

**Remember:** Secrets are encrypted and cannot be viewed after creation. Store them securely!
