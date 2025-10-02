# Implementation Plan: Hong Kong Asian Film Festival Screening Selector

**Branch**: `001-given-this-film` | **Date**: 2025-10-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/Users/swong/hkaff-2025-selector/specs/001-given-this-film/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A responsive web application for Hong Kong Asian Film Festival 2025 attendees to browse the film catalogue, select screenings they want to attend, manage scheduling conflicts, and export their personalized schedule. The app provides bilingual support (Traditional Chinese/English), stores selections in browser local storage (no user accounts), and deploys as a static single-page application on Cloudflare Workers with edge caching for optimal global performance.

## Technical Context
**Language/Version**: TypeScript 5.x / JavaScript ES2022+, Node.js 18+  
**Primary Dependencies**: Modern frontend framework (React/Vue/Svelte TBD in research), i18n library for TC/EN switching, date/time utilities for scheduling logic  
**Storage**: Browser LocalStorage API (client-side only, no backend database)  
**Testing**: Vitest or Jest for unit/integration tests, Playwright for E2E testing  
**Target Platform**: Cloudflare Workers (edge runtime), static asset hosting on Cloudflare Pages
**Project Type**: Single-page web application (frontend-only, no backend services)  
**Performance Goals**: < 1 second response time for all user interactions (NFR-003), initial load < 3 seconds on 3G connection  
**Constraints**: Static data snapshot (no live API calls), client-side-only computation, responsive design for mobile+desktop, < 5MB bundle size  
**Scale/Scope**: ~50-100 films, ~200-500 screenings total, single festival season (static catalogue), expected 1k-10k concurrent users during festival period

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Status**: Template constitution detected - no specific project principles enforced. Proceeding with general best practices:
- ✅ Single frontend application (no backend complexity)
- ✅ Static data approach (simplicity over real-time sync)
- ✅ Browser-native storage (LocalStorage, no external dependencies)
- ✅ Edge deployment (Cloudflare Workers for global performance)
- ✅ Framework selection deferred to research phase (evaluate options)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/          # UI components (film cards, schedule view, filters)
├── models/              # TypeScript interfaces (Film, Screening, Venue, Category)
├── services/            # Business logic (storage, scheduling, conflict detection, export)
├── i18n/                # Localization data (TC/EN translations)
├── data/                # Static film/screening catalogue (JSON snapshot)
├── utils/               # Helper functions (date/time, formatters)
└── App.tsx/vue/svelte   # Main application entry

tests/
├── unit/                # Component and service unit tests
├── integration/         # User flow integration tests
└── e2e/                 # Playwright end-to-end tests

public/
└── index.html           # HTML shell

wrangler.toml            # Cloudflare Workers configuration
package.json
tsconfig.json
vite.config.ts           # Build configuration
```

**Structure Decision**: Single-page application structure. All logic runs client-side in browser. Cloudflare Workers serves static assets with edge caching. No backend services required - all data processing (filtering, conflict detection, export) happens in-browser using JavaScript.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh opencode`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Data extraction tasks (scrape HKAFF website → JSON files)
- Model/interface tasks from service-interfaces.ts [P]
- Service implementation tasks (StorageService, ConflictDetector, MarkdownExporter, etc.)
- Component tasks (FilmList, ScheduleView, FilterPanel, LanguageToggle)
- Integration test tasks from acceptance scenarios in spec.md
- E2E test tasks covering all 10 quickstart validation journeys

**Ordering Strategy**:
1. **Phase 1: Data Foundation** [P]
   - Scraping script development
   - Data extraction and validation
   - JSON schema validation

2. **Phase 2: Core Services** [P after data ready]
   - StorageService (contract tests first)
   - ConflictDetector (unit tests first)
   - MarkdownExporter (unit tests first)

3. **Phase 3: UI Components** [P after services ready]
   - App shell and routing
   - Film catalogue components
   - Schedule view components
   - Filter components
   - Language toggle

4. **Phase 4: Integration & Testing**
   - Integration tests for acceptance scenarios
   - E2E tests for quickstart validation
   - Performance optimization
   - Responsive design validation

**Estimated Output**: 35-45 numbered, ordered tasks in tasks.md

**Key Parallel Groups**:
- Data model interfaces can be created in parallel [P]
- Service implementations can be developed in parallel after contracts exist [P]
- UI components can be built in parallel after services are stable [P]

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (template constitution - no violations)
- [x] Post-Design Constitution Check: PASS (single frontend app, browser-native storage, static data)
- [x] All NEEDS CLARIFICATION resolved (all research decisions documented)
- [x] Complexity deviations documented (N/A - no deviations)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
