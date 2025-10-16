<!-- 
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 (initial) → 1.0.0 (initialized)
Modified Principles: (N/A - initial adoption)
Added Sections: 
  - Five core principles specific to HKAFF project
  - Quality & Testing Standards
  - Deployment & Infrastructure
  - Development Workflow
Removed Sections: (N/A - initial)
Templates Updated:
  ✅ .specify/templates/plan-template.md - verified, Constitution Check alignment OK
  ✅ .specify/templates/spec-template.md - verified, no breaking changes
  ✅ .specify/templates/tasks-template.md - verified, testing discipline matches P3
  ⚠ .specify/templates/commands/ - clarify agent names vs generic guidance
Deferred Items: None
-->

# HKAFF 2025 Selector Constitution

The HKAFF 2025 Selector is a responsive web application that helps festival attendees browse films, select screenings, manage their personal schedule, and detect scheduling conflicts. This constitution establishes non-negotiable governance principles to ensure quality, maintainability, and user trust.

## Core Principles

### I. Test-Driven Development (TDD) - NON-NEGOTIABLE
All functionality must follow strict TDD: tests written and verified to fail **before** implementation begins. 
- **Scope**: Unit tests (business logic), Contract tests (interfaces), E2E tests (user scenarios)
- **Coverage Requirement**: ≥80% for services, 100% for critical paths (conflict detection, scheduling)
- **Red-Green-Refactor**: Tests fail → implementation → tests pass → refactor for clarity
- **Rationale**: Prevents bugs in schedule conflicts (high user impact), ensures API stability, builds confidence in refactoring

### II. Bilingual-First Design
All user-facing text, UI copy, and labels must support Traditional Chinese (TC) and English (EN) from day one.
- **Implementation**: Use i18next with namespace structure (common, films, schedules, conflicts)
- **Validation**: Every new feature includes TC/EN translation keys before code review
- **No English-only fallbacks**: Incomplete translations block PR merge
- **Rationale**: Festival audience is primarily Hong Kong-based; language inclusivity is a feature, not an afterthought

### III. Responsive Mobile-First Architecture
Applications must work seamlessly on mobile (320px), tablet (768px), and desktop (1280px+) from initial design.
- **Priority**: Mobile experience optimized first; enhancement for larger screens
- **Touch targets**: Minimum 44×44px interactive elements (WCAG standard)
- **Testing**: Automated responsive tests for critical flows (film search, schedule management)
- **Rationale**: Majority of festival attendees browse on mobile during events; poor mobile UX directly impacts adoption

### IV. Observability & Conflict Detection Robustness
Conflict detection is mission-critical; all edge cases must be visible and testable.
- **Logging**: Structured logs for scheduling logic, conflict reasoning, and API calls
- **Visible State**: Users see why conflicts exist (overlap duration, venue distance, time gaps)
- **Testing**: Contract tests verify conflict logic against 20+ edge case scenarios
- **Rationale**: Incorrect conflict detection breaks user trust and festival experience

### V. Single-Source-of-Truth Data Model
Film, screening, venue, and category data must be immutable static JSON; no runtime mutations or server-side state.
- **Data Files**: `dist/data/films.json`, `screenings.json`, `venues.json`, `categories.json`
- **User State**: LocalStorage only (no backend required); export as markdown for portability
- **Validation**: JSON Schema validation on load; invalid data blocks app initialization
- **Rationale**: Simplicity (no backend complexity), offline-first capability, easy auditing and versioning

## Quality & Testing Standards

**Mandatory Test Types**:
- Contract tests: Data schema validation (JSON Schema), API interface compliance
- Unit tests: Service layer (storage, conflict detection, date helpers, export)
- E2E tests: User scenarios (film browsing, schedule building, conflict resolution, export)

**Quality Gates**:
- All PRs must pass: `npm test` (74+ tests), type checking (`npx tsc --noEmit`), and linting
- No unhandled promise rejections or console errors in E2E tests
- Accessibility: Lighthouse score ≥90 on performance, ≥95 on accessibility

**Breaking Change Protocol**:
- Any change to data schemas, API interfaces, or i18n keys requires MAJOR version bump
- Changelog entry mandatory for visible user changes
- Backward compatibility testing for 1 prior major version

## Deployment & Infrastructure

**Deployment Target**: Cloudflare Workers (edge compute)
- **Static Assets**: Served from `dist/` directory, cached aggressively (1-year TTL for immutable assets)
- **SPA Routing**: All non-API routes fallback to `index.html`; React Router handles client-side navigation
- **Health Checks**: `/api/health` endpoint verifies worker is responsive
- **Environment Parity**: Production, staging, and development environments identical except for logging verbosity

**Build Process**:
- Frontend build: `npm run build` (Vite → `dist/`)
- Worker build: `npm run build:cf` (TypeScript → worker handler)
- Deployment: `npm run deploy` (wrangler CLI)

## Development Workflow

**Branch Strategy**:
- Feature branches: `feature/<name>` (from `main`)
- Hotfix branches: `hotfix/<name>` (from `main`, fast-tracked)
- All branches require passing CI (tests, lint, build)

**Code Review Checklist**:
1. ✅ Tests written first, passing, and comprehensive
2. ✅ Constitution principles verified (TDD, i18n, responsive, observability)
3. ✅ TypeScript types correct, no `any` without justification
4. ✅ i18n keys added to both TC and EN namespaces
5. ✅ No hardcoded English text in components
6. ✅ Changelog updated with user-visible changes

**Commit Message Format**:
```
type(scope): brief description

Longer explanation (wrap at 100 chars):
- Principle reference (e.g., "Adheres to TDD—tests written first")
- Any breaking changes noted
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

## Governance

**Amendment Procedure**:
1. Proposed change documented in PR with rationale
2. Minimum 1 maintainer approval required
3. Constitution.md updated with new version
4. All dependent templates and docs reviewed for consistency
5. Merge only when all validation checks pass

**Version Numbering**:
- MAJOR: Removal or redefinition of core principles, or backward-incompatible schema changes
- MINOR: Addition of new principle or section, or materially expanded guidance
- PATCH: Clarifications, wording improvements, or non-semantic refinements

**Compliance Review**:
- **Quarterly**: Review principle adherence across recent commits
- **Per-PR**: Automated checks flag potential violations (i18n keys, test coverage, type errors)
- **Annual**: Full constitution assessment; propose updates if principles no longer serve project

**Supersession & Precedence**:
This constitution supersedes all other guidance. If conflicts arise between this document and inline comments, task descriptions, or agent-specific guidance, the constitution is authoritative. Runtime guidance (CLAUDE.md, AGENTS.md, etc.) provides *how to apply* principles, not exceptions.

---

**Version**: 1.0.0 | **Ratified**: 2025-10-16 | **Last Amended**: 2025-10-16
