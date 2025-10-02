# Development Commands - HKAFF 2025 Selector

## Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test              # Run all tests
npm run test:unit         # Run unit tests with Vitest
npm run test:e2e          # Run E2E tests with Playwright
npm run test:contract     # Run contract tests for schemas and interfaces
npm run test:coverage     # Generate coverage report
```

## Data Extraction Commands
```bash
# Run HKAFF website scraper (one-time setup)
node scripts/scrapeHKAFF.js

# Verify scraped data files
ls -la frontend/public/data/
# Should contain: films.json, screenings.json, venues.json, categories.json
```

## Development Workflow Commands
```bash
# Check prerequisites before implementation
./.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks

# Git operations
git add .
git commit -m "feat: implement [task description]"
git push

# View task progress
cat specs/001-given-this-film/tasks.md | grep -E "^\- \[X\]|\- \[ \]"
```

## Testing Commands by Phase
```bash
# Phase 3.3: TDD - Tests should FAIL first
npm run test:contract     # Contract tests (T014-T022) - should fail
npm run test:unit         # Unit tests (T023-T026) - should fail
npm run test:e2e          # E2E tests (T027-T034) - will fail until integration

# Phase 3.8: Validation - All tests should PASS
npm run test:contract     # Verify schema compliance
npm run test:unit         # Verify service logic with ≥80% coverage
npm run test:e2e          # Verify all 7 user scenarios pass
```

## Performance Validation Commands
```bash
# Bundle size analysis
npm run build
npx bundlesize

# Lighthouse performance audit
npm run build
npm run preview
# Then run Lighthouse in Chrome DevTools

# Responsive testing
npm run dev
# Test at breakpoints: 320px, 768px, 1280px
```

## Utility Commands
```bash
# Find files by pattern
find . -name "*.jsx" -o -name "*.js" | grep -v node_modules

# Search in files
grep -r "function" src/ --include="*.js" --include="*.jsx"

# Check TypeScript types
npx tsc --noEmit

# Format code (if Prettier is configured)
npx prettier --write src/
```

## Troubleshooting Commands
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist/

# Check for TypeScript errors
npm run typecheck

# Verify LocalStorage data (in browser console)
JSON.parse(localStorage.getItem('hkaff-selections'))
```

## Quickstart Validation Commands
```bash
# Complete validation sequence (from quickstart.md)
npm install
node scripts/scrapeHKAFF.js
npm run dev
# Then manually validate all 10 user scenarios
```