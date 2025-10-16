# Cloudflare Workers Deployment Guide

## Overview

The HKAFF 2025 Selector is configured to run on Cloudflare Workers with static asset serving. The worker handles:
- Static asset delivery (HTML, CSS, JS, images) with optimized caching
- SPA fallback routing (all non-API requests route to `/index.html`)
- Health check endpoint (`/api/health`)
- Proper cache headers based on asset type

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         Cloudflare Workers (Edge Network)           │
├─────────────────────────────────────────────────────┤
│  src/index.ts (Worker Handler)                      │
│  ├── Router (itty-router)                           │
│  ├── Static Assets (dist/)                          │
│  ├── SPA Fallback                                   │
│  └── Health Checks                                  │
├─────────────────────────────────────────────────────┤
│  Cloudflare KV (Optional)                           │
│  ├── Cache layer                                    │
│  └── Dynamic data storage                           │
└─────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Prerequisites

```bash
# Install Node.js 18+ and npm
node --version  # Should be v18+
npm --version   # Should be v9+

# Install Wrangler CLI (already in devDependencies)
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
# Login to your Cloudflare account
npm run workers:login

# Verify authentication
npm run workers:whoami
```

### 3. Create Cloudflare Project

Go to https://dash.cloudflare.com and:

1. **Create a Workers Project**
   - Click "Workers & Pages"
   - Click "Create application"
   - Select "Create a Worker"
   - Name: `hkaff-2025-selector`

2. **Bind Custom Domain (Optional)**
   - Go to project settings
   - Add custom domain (e.g., `hkaff2025.example.com`)
   - Point DNS records to Cloudflare

3. **Set Up KV Namespace (Optional)**
   - Go to "Workers KV"
   - Create namespace: `hkaff-2025-kv`
   - Bind to worker (already configured in `wrangler.jsonc`)

### 4. Configure Environment Variables

Update `wrangler.jsonc` with your domain:

```jsonc
{
  "routes": [
    {
      "pattern": "your-domain.com/*",
      "zone_id": "your-zone-id"
    }
  ]
}
```

Or use route prefixes:

```bash
# Example route
hkaff2025.example.com/*
```

## Development

### Local Testing

```bash
# Build frontend
npm run build

# Start worker locally
npm run dev:cf

# Visit http://localhost:8787
```

### Available Development Commands

```bash
# Development with local worker
npm run dev:cf

# Just build for workers
npm run build:cf

# Run tests
npm test

# Run specific test suites
npm run test:unit
npm run test:contract
npm run test:e2e
```

## Deployment

### Deploy to Staging

```bash
# Uses staging environment from wrangler.jsonc
npm run deploy:staging

# Deployed to: hkaff2025-staging.workers.dev
```

### Deploy to Production

```bash
# Uses production environment from wrangler.jsonc
npm run deploy:production

# Deployed to: hkaff2025.workers.dev (or custom domain)
```

### Quick Deploy

```bash
# Deploy with default settings
npm run deploy
```

### Verify Deployment

```bash
# Check health endpoint
curl https://hkaff2025.workers.dev/api/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2025-10-16T10:30:00.000Z",
#   "environment": "production"
# }
```

## Configuration Details

### wrangler.jsonc

The Cloudflare configuration includes:

```jsonc
{
  "name": "hkaff-2025-selector",
  "main": "src/index.ts",              // Worker entry point
  "compatibility_date": "2025-10-16",   // API compatibility date
  "assets": {
    "directory": "./dist",              // Static files directory
    "binding": "ASSETS"                 // Make available as env.ASSETS
  },
  "env": {
    "production": { },                  // Production environment
    "staging": { },                     // Staging environment
    "development": { }                  // Development environment
  },
  "build": {
    "command": "npm run build",         // Build command
    "cwd": "."
  },
  "observability": {
    "enabled": true                     // Enable analytics
  }
}
```

### Caching Strategy

```
Route                           Cache-Control
────────────────────────────────────────────────────────
/index.html                     no-cache
/api/*                          no-cache
*.js, *.css                     public, max-age=31536000, immutable
*.woff2, *.png, *.jpg, *.svg    public, max-age=31536000, immutable
/                               no-cache
Other HTML files                no-cache
```

### SPA Routing

The worker implements SPA routing:

1. Request to `/about`
2. Not found in static assets
3. Falls back to `/index.html`
4. React Router handles the route

This allows client-side routing to work seamlessly.

## Environment Variables

Define variables in `wrangler.jsonc`:

```jsonc
{
  "env": {
    "production": {
      "vars": {
        "ENVIRONMENT": "production",
        "API_URL": "https://api.example.com",
        "LOG_LEVEL": "error"
      }
    }
  }
}
```

Access in worker:

```typescript
export default async (req: Request, env: Env) => {
  console.log(env.ENVIRONMENT); // "production"
  console.log(env.API_URL);     // "https://api.example.com"
};
```

## KV Namespace Usage (Optional)

If you've created a KV namespace, use it in the worker:

```typescript
export default async (req: Request, env: Env) => {
  // Store data
  await env.KV?.put('key', 'value', { expirationTtl: 3600 });
  
  // Retrieve data
  const value = await env.KV?.get('key');
  
  // Delete data
  await env.KV?.delete('key');
};
```

## Monitoring & Analytics

### View Logs

```bash
# Tail live logs
wrangler tail

# View logs with filters
wrangler tail --format json
```

### Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Navigate to "Workers"
3. Select `hkaff-2025-selector`
4. View analytics, logs, and errors

## Performance Optimization

### Bundle Size

```bash
# Check current build size
npm run build
ls -lh dist/assets/

# Target: < 200KB gzipped
```

### Caching Best Practices

- **Immutable assets** (versioned): 1 year TTL
- **HTML files**: no-cache (always check for updates)
- **API responses**: vary by endpoint

### CDN Performance

The worker runs on Cloudflare's global edge network:
- Low latency (< 100ms to most users)
- Automatic compression (gzip, brotli)
- DDoS protection included

## Troubleshooting

### Worker Not Responding

```bash
# Check if worker is deployed
wrangler deployments list

# View recent logs
wrangler tail

# Redeploy
npm run deploy
```

### 404 Errors on Navigation

Ensure SPA routing fallback is working:

```typescript
// In src/index.ts, check:
// 1. Asset binding is configured
// 2. Fallback to /index.html is implemented
// 3. Build output is in ./dist/
```

### Asset Not Found

```bash
# Verify assets are built
npm run build
ls -la dist/

# Check wrangler assets configuration
cat wrangler.jsonc | grep assets
```

### Cache Issues

```bash
# Purge Cloudflare cache
# Go to: https://dash.cloudflare.com > Caching > Purge Cache

# Or use wrangler tail to verify cache headers
wrangler tail | grep "Cache-Control"
```

## Custom Domain Setup

### Add Domain to Cloudflare

1. Go to https://dash.cloudflare.com
2. Add your domain (e.g., `example.com`)
3. Update nameservers at registrar
4. Wait for DNS propagation (24-48 hours)

### Route Worker to Domain

In `wrangler.jsonc`:

```jsonc
{
  "routes": [
    {
      "pattern": "hkaff2025.example.com/*",
      "zone_id": "your-zone-id"
    }
  ]
}
```

### Deploy with Custom Domain

```bash
npm run deploy

# Visit https://hkaff2025.example.com
```

## Scaling & Limits

### Worker Limits

- **CPU time**: 50ms (configurable in `wrangler.jsonc`)
- **Memory**: 128MB
- **Request size**: 100MB
- **Timeout**: 10 seconds (default)

### Cloudflare Limits

Free plan:
- Unlimited requests
- 100,000 writes/day to KV
- 1,000 reads/day to KV

Paid plans: Higher limits

## Security

### Headers

The worker adds security headers:

```typescript
// Add in middleware:
headers.set('X-Content-Type-Options', 'nosniff');
headers.set('X-Frame-Options', 'SAMEORIGIN');
headers.set('X-XSS-Protection', '1; mode=block');
```

### CORS

Configure CORS if needed:

```typescript
if (req.method === 'OPTIONS') {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}
```

### SSL/TLS

Cloudflare provides free SSL/TLS:
- Certificate auto-provisioning
- Flexible, Full, or Full (Strict) modes
- Automatic renewal

## Rollback

### Revert to Previous Deployment

```bash
# View deployments
wrangler deployments list

# Rollback to specific version
wrangler deployments rollback

# Select version from list
```

## CI/CD Integration

### GitHub Actions (Example)

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Next Steps

1. ✅ Set up Cloudflare account
2. ✅ Create Workers project
3. ✅ Configure custom domain (optional)
4. ✅ Deploy to staging: `npm run deploy:staging`
5. ✅ Test thoroughly
6. ✅ Deploy to production: `npm run deploy:production`
7. ✅ Monitor logs and analytics

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [itty-router](https://github.com/kwhitley/itty-router)
- [Cloudflare KV Docs](https://developers.cloudflare.com/workers/runtime-apis/kv/)

## Support

For issues or questions:
1. Check deployment logs: `wrangler tail`
2. Review Cloudflare dashboard analytics
3. Check worker errors: Dashboard > Workers > Logs
4. Consult Cloudflare support
