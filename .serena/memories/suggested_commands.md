# Suggested Commands for HKAFF 2025 Selector Development

## Daily Development Workflow
```bash
# Start development day
cd /Users/swong/hkaff-2025-selector
git pull origin main
npm install
npm run dev

# Check current task status
cat specs/001-given-this-film/tasks.md | grep -E "^\- \[X\]|\- \[ \]" | head -10

# Run tests before making changes
npm run test:unit
npm run test:contract
```

## Task Implementation Commands
```bash
# Before starting any task
./.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks

# During development (run frequently)
npm run typecheck      # Catch TypeScript errors early
npm run lint          # Maintain code quality
npm run test:unit     # Verify unit tests pass
npm run test:contract # Verify contract compliance

# After completing a task
npm run test          # Full test suite
npm run build         # Verify production build works
git add .
git commit -m "feat: implement T0XX - [task description]"
```

## Phase-Specific Commands

### Phase 3.1: Setup
```bash
# T001: Create project structure
mkdir -p frontend/src/{components,services,utils}
mkdir -p frontend/public/{data,locales/{tc,en}}
mkdir -p tests/{unit,contract,e2e}
mkdir -p scripts

# T002: Initialize project
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install

# Install dependencies
npm install react-i18next i18next date-fns
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @playwright/test
npm install -D @testing-library/react @testing-library/jest-dom
```

### Phase 3.2: Data Extraction
```bash
# T007-T012: Create scraper
npm install playwright
# Create scripts/scrapeHKAFF.js

# T013: Run scraper
node scripts/scrapeHKAFF.js
ls -la frontend/public/data/  # Verify 4 JSON files exist
```

### Phase 3.3: Tests First (TDD)
```bash
# T014-T017: Contract tests (should FAIL)
npm run test:contract

# T018-T022: Service interface tests (should FAIL)
npm run test:contract

# T023-T026: Unit tests (should FAIL)
npm run test:unit

# T027-T034: E2E tests (will fail until integration)
npm run test:e2e
```

### Phase 3.4: Service Implementation
```bash
# T035-T041: Implement services
# After each service implementation:
npm run test:unit     # Should start passing
npm run test:contract # Should start passing
```

### Phase 3.8: Final Validation
```bash
# T065-T067: All tests must pass
npm run test:contract
npm run test:unit
npm run test:e2e

# T068: Build size check
npm run build
npx bundlesize

# T069: Performance audit
npm run build
npm run preview
# Run Lighthouse in Chrome DevTools

# T070: Quickstart validation
# Manually test all 10 scenarios from quickstart.md
```

## Debugging Commands
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run specific test file
npm run test tests/unit/storageService.test.js

# Run tests in watch mode
npm run test:unit -- --watch

# Debug Playwright tests
npm run test:e2e -- --debug

# Check bundle size
npm run build
npx vite-bundle-analyzer dist/static/js/*.js

# Profile performance
npm run dev
# Open Chrome DevTools -> Performance tab
```

## Git Workflow Commands
```bash
# Feature branch workflow
git checkout -b feature/T0XX-task-description
# Implement task
git add .
git commit -m "feat: T0XX implement [task description]"
git push origin feature/T0XX-task-description

# Squash commits before PR
git rebase -i HEAD~3  # Interactive rebase

# Check git status
git status
git diff --staged    # Review staged changes
```

## Utility Commands
```bash
# Find and replace in files
find . -name "*.js" -o -name "*.jsx" | xargs grep -l "oldPattern"
find . -name "*.js" -o -name "*.jsx" | xargs sed -i '' 's/oldPattern/newPattern/g'

# Check for unused dependencies
npx depcheck

# Update dependencies
npm update
npm audit fix

# Clean up
rm -rf node_modules package-lock.json
npm install

# Generate TypeScript documentation
npx typedoc src/
```

## Testing Commands by Category
```bash
# Unit testing
npm run test:unit -- --coverage
npm run test:unit -- --reporter=verbose

# Contract testing
npm run test:contract -- --verbose

# E2E testing
npm run test:e2e -- --headed
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=webkit

# Performance testing
npm run test:e2e -- --trace on
```

## Environment-Specific Commands
```bash
# Development
npm run dev           # Start dev server
npm run typecheck     # TypeScript checking
npm run lint          # Code linting

# Production
npm run build         # Build for production
npm run preview       # Preview production build
npm run serve         # Serve production build

# CI/CD
npm run test:ci       # Tests for CI environment
npm run build:ci      # Build for CI environment
```

## Quick Reference
```bash
# Most common development cycle
npm run dev           # Start coding
npm run test:unit     # Run tests
npm run typecheck     # Check types
npm run lint          # Check style
npm run build         # Verify build
git commit -m "..."   # Commit changes

# Check project health
npm run test          # All tests
npm run build         # Production build
npm run lint          # Code quality
npm run typecheck     # Type safety
```