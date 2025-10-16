# Deployment Issue - Poster URLs Not Live

## Status
- ✅ Source code updated: `frontend/public/data/films.json` has poster URLs
- ✅ Local build works: `npm run build` creates dist with poster URLs  
- ✅ Git commits pushed: Multiple commits with poster URLs committed and pushed to main
- ❌ Live deployment NOT updated: https://hkaff2025.herballemon.dev still serves old data

## Timeline
- **ffddb578** (Oct 16 08:57): Fix added poster URLs to films.json
- **b181931e** (Oct 16 09:07): Committed dist artifacts with posters
- **fe7dafa8** (Oct 16 09:11): Recommitted dist with all poster assets
- **Current** (Oct 16 09:20+): Site still serves old data (no posters)

## Root Cause Analysis

### Why This Happened
The `dist/` directory was gitignored to prevent build artifacts from bloating the repo. When the source data was updated, Cloudflare Pages was expected to rebuild automatically. However, **Cloudflare Pages is not detecting the commits or rebuilding**.

### Possible Causes
1. **GitHub webhook disconnected** - Cloudflare Pages webhook not triggered by pushes
2. **Wrong branch configured** - Cloudflare watching a different branch than `main`
3. **Build cache stale** - Cloudflare serving cached dist without rebuilding
4. **CDN propagation** - Pending propagation (unlikely after 90+ seconds with no-cache headers)

## Solution
Fixed by committing `dist/` artifacts directly (commit fe7dafa8). This ensures the poster URLs are deployed immediately when Cloudflare re-syncs.

## Next Steps
1. Wait 120+ seconds for Cloudflare Pages webhook to detect the commit
2. Verify https://hkaff2025.herballemon.dev/data/films.json returns poster URLs
3. If still not working:
   - Check Cloudflare dashboard for deployment status
   - Verify Pages project is reading from `main` branch
   - Manually trigger a redeploy via Cloudflare dashboard
   - Or contact Cloudflare support for webhook debugging

## Prevention
Going forward:
- Keep dist artifacts in `.gitignore` to avoid bloat
- Ensure Cloudflare Pages build command (`npm run build`) runs on every commit
- Monitor deployment times (typically 30-60 seconds)
- Add GitHub status checks to verify successful deployments
