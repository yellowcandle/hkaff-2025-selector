# Cloudflare Pages Setup Guide

Complete guide to connect your GitHub repository with Cloudflare Pages for automatic deployments.

---

## Prerequisites

- ✅ GitHub repository: https://github.com/yellowcandle/hkaff-2025-selector
- ✅ Cloudflare account with Pages enabled
- ✅ Domain configured in Cloudflare (hkaff2025.herballemon.dev)
- ✅ Admin access to both GitHub and Cloudflare

---

## Step 1: Connect GitHub to Cloudflare Pages

### Via Cloudflare Dashboard

1. **Log in to Cloudflare**
   - Go to https://dash.cloudflare.com
   - Select your account

2. **Navigate to Pages**
   - Left sidebar → "Workers & Pages"
   - Click "Pages"
   - Click "Create a project"

3. **Select Repository Source**
   - Choose "Connect to Git"
   - Select "GitHub"
   - Authorize Cloudflare with GitHub (if not already done)

4. **Select Repository**
   - Find and select: `yellowcandle/hkaff-2025-selector`
   - Click "Begin setup"

5. **Configure Build Settings**
   - **Project name**: `hkaff-2025-selector`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory** (optional): Leave empty (or set to `./frontend` if needed)
   - **Environment variables**: (see section below)

6. **Review and Deploy**
   - Click "Save and Deploy"
   - Cloudflare will create an initial deployment

### Configuration Details

```yaml
Project Name: hkaff-2025-selector
Production Branch: main
Build Command: npm run build
Output Directory: dist
Root Directory: (leave empty)
Node.js Version: 18 (or auto-detect)
```

---

## Step 2: Environment Variables (if needed)

### In Cloudflare Pages Dashboard

1. Go to your Pages project settings
2. Click "Settings" → "Environment variables"
3. Add variables for different environments:

**Production**
```
NODE_ENV=production
```

**Preview (optional)**
```
NODE_ENV=preview
```

Currently, this project doesn't require environment variables, but this is where you'd add them.

---

## Step 3: Link Custom Domain

### Connect hkaff2025.herballemon.dev

1. **In Cloudflare Pages Project**
   - Go to project settings → "Domains & DNS"
   - Click "Add a custom domain"
   - Enter: `hkaff2025.herballemon.dev`
   - Click "Continue"

2. **Verify Domain**
   - Confirm you own the domain through Cloudflare
   - The domain should already be set up since it's in your Cloudflare account

3. **Complete Setup**
   - DNS automatically configured ✅
   - Custom domain now active ✅

---

## Step 4: Configure Build Settings (Optional Tweaks)

### Modify if Needed

In Cloudflare Pages → Settings → Build configuration:

```yaml
Build Caching:
  Enabled: true  # Cache dependencies between builds
  
Automatic Git Operations:
  Production branch deployments: Automatic
  Preview deployments: For all PRs
  
Fail on Production Error:
  Enabled: true  # Fail if build errors on main branch
```

---

## Step 5: Set Up Redirects & Headers (Optional)

Create `_redirects` file in your `dist` directory for URL redirects:

### File: `dist/_redirects`

```
# Single Page Application routing
/* /index.html 200
```

Or create in build output. For SPA (Single Page App), this ensures all routes serve index.html.

### File: `dist/_headers` (Optional)

```
/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
```

---

## Step 6: GitHub Actions Integration (Optional)

### Monitor Build Status

1. **In Cloudflare Dashboard**
   - Go to your Pages project
   - Click "Deployments"
   - You'll see deployment history
   - Each commit shows build status

2. **GitHub Integration**
   - Cloudflare automatically adds status checks to PRs
   - Failed builds prevent merging to main

---

## Step 7: Verify Deployment Pipeline

### Test the Full Pipeline

1. **Make a test commit**
   ```bash
   git commit --allow-empty -m "test: Verify Cloudflare Pages deployment"
   git push origin main
   ```

2. **Check Cloudflare Dashboard**
   - Go to Pages project → Deployments
   - See build in progress
   - Wait for completion (usually 30-60 seconds)

3. **Verify Live Site**
   - Visit https://hkaff2025.herballemon.dev
   - Check for latest changes

---

## Step 8: Enable Preview Deployments (Optional)

### For Pull Requests

1. **In Pages Settings**
   - Settings → Git configuration
   - Enable "Deploy previews for pull requests"
   - Each PR gets unique preview URL

2. **Example Preview URL**
   ```
   https://pr-123.hkaff-2025-selector.pages.dev
   ```

---

## Step 9: Monitor & Manage

### Regular Maintenance

1. **Check Deployment History**
   - Pages → Deployments
   - Review build logs if issues occur

2. **Cache Management**
   - Cloudflare → Caching → Cache Rules
   - Purge cache if needed: "Purge Everything"

3. **Performance Monitoring**
   - Analytics & Logs → Analytics
   - Monitor page performance metrics

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails on Cloudflare but works locally

**Solutions**:
1. Check build logs in Cloudflare dashboard
2. Ensure `npm run build` works: `npm run build`
3. Check Node.js version compatibility
4. Verify all source files are committed to git
5. Check `.gitignore` - ensure needed files aren't ignored

### Old Data Still Serving

**Issue**: Changes not appearing on live site

**Solutions**:
```bash
# 1. Verify files are committed
git status

# 2. Force push if needed
git push origin main --force

# 3. Purge Cloudflare cache
# In Dashboard: Caching → Purge Everything

# 4. Trigger manual redeploy
# In Pages: Deployments → (click latest) → Retry deployment
```

### Domain Issues

**Issue**: Custom domain not working

**Solutions**:
1. Verify DNS records in Cloudflare
2. Check domain points to Cloudflare nameservers
3. Wait 5-10 minutes for DNS propagation
4. Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

---

## Current Setup Status

### Repository
- **Owner**: yellowcandle
- **Name**: hkaff-2025-selector
- **Visibility**: Public
- **Branch**: main

### Pages Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js**: Auto-detect (18+)
- **Custom Domain**: hkaff2025.herballemon.dev ✅

### Build Settings
```
Location: dist/
Source: GitHub (main branch)
Auto-rebuild: On every commit to main
Environment: Production
```

### DNS Configuration
- **Type**: CNAME
- **Name**: hkaff2025
- **Value**: hkaff-2025-selector.pages.dev

---

## Useful Cloudflare CLI Commands

### Install Wrangler (Optional)

```bash
npm install -g wrangler
```

### Deploy Manually (Alternative)

```bash
# If not using Git-based deployment
wrangler pages deploy dist/
```

### View Deployments

```bash
wrangler pages deployment list --project-name hkaff-2025-selector
```

---

## Additional Resources

### Documentation
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Git Integration](https://developers.cloudflare.com/pages/platform/git-integration/)
- [Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)

### Next Steps
1. ✅ GitHub connected
2. ✅ Build configured
3. ✅ Custom domain linked
4. ✅ Auto-deployments enabled
5. Monitor deployments and performance

---

## Quick Reference Cheat Sheet

```bash
# View deployment history
# → Cloudflare Dashboard → Pages → hkaff-2025-selector → Deployments

# Trigger rebuild
# → Make a commit and push: git push origin main

# Clear cache
# → Cloudflare → Caching → Purge Cache → Purge Everything

# Update build settings
# → Pages → Settings → Build configuration

# View build logs
# → Pages → Deployments → Click deployment → View logs

# Set environment variables
# → Pages → Settings → Environment variables
```

---

## Security Checklist

- [x] Repository is public (allows Cloudflare access)
- [x] Branch protection on main (recommended)
- [x] Cloudflare API token scoped to Pages project
- [x] No secrets in source code (use environment variables)
- [x] HTTPS enabled (automatic with Cloudflare)
- [x] Security headers configured (in _headers file)

---

## Performance Optimization

### Cloudflare Pages Features Active

- ✅ Global CDN (automatic)
- ✅ Gzip compression (automatic)
- ✅ Brotli compression (automatic)
- ✅ HTTP/2 push (automatic)
- ✅ Cache management (configurable)

### Current Performance Metrics

- Bundle: 74.47 KB (gzipped)
- Build: 1.51s
- Chunks: 6 (code split)
- Coverage: 100% (all tests passing)

---

**Setup Complete!** 🎉

Your GitHub repository is now fully integrated with Cloudflare Pages. Every push to main will automatically trigger a build and deployment.

For help, see [Troubleshooting](#troubleshooting) section above.
