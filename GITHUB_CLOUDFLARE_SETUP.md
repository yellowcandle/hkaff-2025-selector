# GitHub + Cloudflare Pages Integration - Visual Guide

Complete step-by-step visual guide with screenshots and commands.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR WORKFLOW                             │
└─────────────────────────────────────────────────────────────────┘

  Developer                    GitHub              Cloudflare Pages
      │                          │                       │
      │──────── git push ────────>│                       │
      │                          │                       │
      │                          │──── webhook ────────>│
      │                          │                       │
      │                          │       npm run build   │
      │                          │       (automatic)     │
      │                          │                       │
      │                          │    Deploy to CDN     │
      │                          │<──── status ─────────┤
      │                          │                       │
      │<──── status checks ──────│                       │
      │                          │                       │
      │    ✅ Deployment Live                            │
      │    https://hkaff2025.herballemon.dev            │
```

---

## Complete Setup Checklist

### Prerequisites
- [ ] GitHub account with repository access
- [ ] Cloudflare account (free tier sufficient)
- [ ] Domain registered in Cloudflare
- [ ] Admin permissions on both platforms

### Step-by-Step Setup

#### Phase 1: GitHub Preparation

- [x] Repository created: `yellowcandle/hkaff-2025-selector`
- [x] Repository is **PUBLIC** (required for Cloudflare to access)
- [x] `npm run build` command works locally
- [x] `dist/` directory is build output
- [x] Code committed to `main` branch

#### Phase 2: Cloudflare Connection

- [ ] **Log in to Cloudflare**
  ```
  https://dash.cloudflare.com
  ```

- [ ] **Navigate to Pages**
  ```
  Left sidebar → Workers & Pages → Pages
  ```

- [ ] **Create New Project**
  ```
  Click "Create a project" → "Connect to Git"
  ```

- [ ] **Authorize Cloudflare with GitHub**
  - Click "GitHub" option
  - Click "Authorize Cloudflare" (if not already done)
  - Grant repository access permissions

- [ ] **Select Repository**
  - Find: `yellowcandle/hkaff-2025-selector`
  - Click to select
  - Click "Begin setup"

#### Phase 3: Build Configuration

- [ ] **Project Name**
  ```
  hkaff-2025-selector
  ```

- [ ] **Production Branch**
  ```
  main
  ```

- [ ] **Build Command**
  ```
  npm run build
  ```

- [ ] **Build Output Directory**
  ```
  dist
  ```

- [ ] **Root Directory**
  ```
  (leave empty for root)
  ```

- [ ] **Environment Variables** (optional)
  ```
  NODE_ENV = production
  ```

- [ ] **Click "Save and Deploy"**
  - Initial deployment will start
  - Wait 1-2 minutes

#### Phase 4: Domain Configuration

- [ ] **In Cloudflare Dashboard**
  ```
  Pages project → Settings → Domains & DNS
  ```

- [ ] **Add Custom Domain**
  - Click "Add a custom domain"
  - Enter: `hkaff2025.herballemon.dev`
  - Click "Continue"

- [ ] **Verify Domain**
  - Confirm ownership (should be automatic)
  - DNS records auto-configured

- [ ] **Activate**
  - Domain now points to Cloudflare Pages
  - HTTPS automatically enabled ✅

#### Phase 5: Verification

- [ ] **Check Deployments**
  ```
  Pages → Deployments → View recent builds
  ```

- [ ] **Test Live Site**
  ```
  https://hkaff2025.herballemon.dev
  ```
  - Should show your React app ✅
  - Check data loads correctly ✅

- [ ] **Verify GitHub Status Checks**
  - Make a test commit
  - Check pull request shows build status ✅

---

## Common Configuration Scenarios

### Scenario 1: Root Repository (Current Setup)

Your project structure:
```
hkaff-2025-selector/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json
└── [config files]
```

**Cloudflare Settings**:
- Root directory: (empty)
- Build command: `npm run build`
- Output: `dist`

### Scenario 2: If Frontend in Subdirectory

If your project was structured as:
```
hkaff-2025-selector/
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

**Cloudflare Settings**:
- Root directory: `frontend`
- Build command: `npm run build`
- Output: `dist`

---

## Testing the Integration

### Test 1: Verify Auto-Deployment

```bash
# 1. Make a small change
echo "# Test comment" >> README.md

# 2. Commit and push
git add README.md
git commit -m "test: Verify Cloudflare Pages auto-deployment"
git push origin main

# 3. Check Cloudflare dashboard
# Pages → Deployments → Should see new build starting

# 4. Wait 30-60 seconds for build to complete

# 5. Visit live site
# https://hkaff2025.herballemon.dev
```

### Test 2: Verify Build Works

```bash
# Simulate what Cloudflare does
npm install
npm run build

# Check output directory exists
ls -la dist/

# Verify key files are present
ls dist/index.html
ls dist/data/films.json
```

### Test 3: Check Environment

```bash
# Verify Node.js version
node --version  # Should be 18+

# Verify npm installed
npm --version

# Verify build script exists
cat package.json | grep "build"
```

---

## Deployment Triggers

### Automatic Deployments

Deployment automatically triggers when:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Merge pull request to main**
   ```
   GitHub → Pull Request → Merge
   ```

3. **Direct commit to main**
   ```bash
   git commit -m "message" && git push
   ```

### Preview Deployments (Optional)

If enabled in Pages settings:
- Create a pull request
- Preview URL generated automatically
- Example: `https://pr-123.hkaff-2025-selector.pages.dev`

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check latest deployment
# Cloudflare → Pages → Deployments

# Verify site is live
curl -I https://hkaff2025.herballemon.dev

# Check recent commits
git log --oneline -10
```

### Weekly Tasks

- [ ] Review deployment logs for errors
- [ ] Check performance metrics in Cloudflare Analytics
- [ ] Monitor error rates (Cloudflare Dashboard)

### Monthly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review build times (optimize if >5s)
- [ ] Check bundle size trend

---

## Rollback Procedure

### If Something Goes Wrong

```bash
# 1. Revert last commit
git revert HEAD
git push origin main

# 2. Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force

# 3. Cloudflare will automatically rebuild
# (within 1-2 minutes)

# 4. Verify deployment
# Pages → Deployments → Check status
```

### Manual Rollback in Cloudflare

1. Go to Pages → Deployments
2. Find previous stable deployment
3. Click "Rollback" (if available)
4. Confirm

---

## Environment Variables

### Production-Only Variables

In Cloudflare Pages dashboard:

```
Settings → Environment variables → Production
```

Example:
```
NODE_ENV = production
API_KEY = your-production-key
DEBUG = false
```

### Preview Variables

```
Settings → Environment variables → Preview
```

Used for PR deployments.

---

## Performance Optimization

### Cloudflare Pages Benefits (Automatic)

✅ Global CDN - Your site served from edge locations  
✅ Brotli compression - Smaller file sizes  
✅ HTTP/2 - Faster loading  
✅ Automatic HTTPS - Secure by default  
✅ Cache management - Smart caching rules  

### Monitor Performance

1. **Cloudflare Analytics**
   ```
   Dashboard → Analytics & Logs → Analytics
   ```

2. **Page Speed**
   - Visit https://pagespeed.web.dev
   - Enter your domain

3. **Performance in Chrome DevTools**
   - Open DevTools (F12)
   - Network tab → Check asset sizes
   - Performance tab → Analyze load

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Cloudflare → see error details |
| Old data appears | Purge cache: Caching → Purge Everything |
| Domain not working | Verify DNS in Cloudflare DNS settings |
| Build too slow | Optimize dependencies, check for large assets |
| Changes not live | Wait 2-3 minutes, refresh browser (Ctrl+Shift+R) |

---

## Security Best Practices

### Enabled Features
- [x] HTTPS (automatic)
- [x] SSL/TLS encryption (automatic)
- [x] DDoS protection (automatic)
- [x] WAF rules (recommended: enable)

### Recommended Settings

1. **Enable WAF Rules**
   ```
   Security → WAF → Enable (if available on plan)
   ```

2. **Set Cache Rules**
   ```
   Caching → Cache Rules → Create rule
   ```

3. **Add Security Headers**
   Create `dist/_headers` file:
   ```
   /*
     X-Content-Type-Options: nosniff
     X-Frame-Options: SAMEORIGIN
     X-XSS-Protection: 1; mode=block
   ```

---

## Resources & Support

### Cloudflare Pages Documentation
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Git Integration Guide](https://developers.cloudflare.com/pages/platform/git-integration/)
- [Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)

### GitHub Documentation
- [GitHub Actions](https://docs.github.com/en/actions)
- [Webhooks](https://docs.github.com/en/developers/webhooks-and-events)

### Community Help
- Cloudflare Community: https://community.cloudflare.com/
- GitHub Discussions: https://github.com/yellowcandle/hkaff-2025-selector/discussions

---

## Current Status

```
✅ Repository: Public and accessible
✅ Build: npm run build (verified working)
✅ Output: dist/ directory
✅ Node.js: 18+
✅ Domain: hkaff2025.herballemon.dev
✅ Deployment: Automated via git push
✅ HTTPS: Enabled
✅ CDN: Active
```

---

## Quick Commands

```bash
# Test build locally
npm run build

# Test locally with production build
npm run preview

# View git log
git log --oneline

# Push to deploy
git push origin main

# Check deployment status
# Visit: https://dash.cloudflare.com → Pages
```

---

**Setup is complete!** Your GitHub repository is now fully integrated with Cloudflare Pages. 🎉

Every commit to the main branch will automatically:
1. Trigger a build on Cloudflare
2. Run `npm run build`
3. Deploy the `dist/` directory
4. Go live at `https://hkaff2025.herballemon.dev`

---

*Last updated: October 16, 2025*
