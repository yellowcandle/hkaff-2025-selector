# Project Context - HKAFF 2025 Selector

## Current Project State
The project is in the initial setup phase with only specification documents completed. No source code has been implemented yet. The project follows a Spec-Driven Development workflow with comprehensive planning documents.

## Project Location & Structure
- **Repository**: `/Users/swong/hkaff-2025-selector`
- **Feature Branch**: `001-given-this-film`
- **Specification Location**: `specs/001-given-this-film/`
- **Active Technologies**: React 18+, Vite, TypeScript, Tailwind CSS, react-i18next, date-fns, Vitest, Playwright

## Development Workflow
This project uses a structured TDD approach with 74 detailed tasks organized in 8 phases:

1. **Phase 3.1**: Setup (T001-T006) - Project structure and tooling
2. **Phase 3.2**: Data Extraction (T007-T013) - Web scraping HKAFF website
3. **Phase 3.3**: Tests First (T014-T034) - TDD - Write failing tests
4. **Phase 3.4**: Service Implementation (T035-T041) - Business logic
5. **Phase 3.5**: Component Implementation (T042-T052) - UI components
6. **Phase 3.6**: Integration (T053-T059) - Wire everything together
7. **Phase 3.7**: Responsive Design (T060-T064) - Mobile-first adaptation
8. **Phase 3.8**: Polish (T065-T074) - Testing, performance, documentation

## Key Implementation Constraints
- **TDD Strict**: Tests MUST be written and MUST FAIL before implementation
- **Parallel Tasks**: Tasks marked [P] can be executed simultaneously
- **Sequential Dependencies**: Some phases must complete before others can start
- **Data First**: Web scraping must complete before any testing can begin
- **Mobile-First**: Responsive design is a core requirement

## Critical Success Factors
1. **Data Quality**: Accurate scraping of HKAFF website data
2. **Test Coverage**: 80%+ for services, 100% for E2E scenarios
3. **Performance**: <1 second interaction response, <180KB bundle
4. **Bilingual Support**: Complete TC/EN language switching
5. **Responsive Design**: Seamless experience across all devices

## Risk Areas
- **Web Scraping**: HKAFF website structure might change
- **Data Volume**: ~80-100 films with multiple screenings each
- **Conflict Detection**: Complex scheduling logic with edge cases
- **Performance**: Filtering and sorting large datasets efficiently
- **i18n Complexity**: Bilingual content with proper formatting

## External Dependencies
- **HKAFF Website**: Source of truth for film/screening data
- **Browser APIs**: LocalStorage for persistence, no backend required
- **CDN Hosting**: Static deployment on Cloudflare Workers planned

## Team & Collaboration
- **Single Developer Project**: No team collaboration complexities
- **Git Workflow**: Feature branch approach with clear commit messages
- **Documentation**: Comprehensive specs and task breakdown for maintainability

## Success Metrics
- All 74 tasks completed with quality gates passed
- All 10 quickstart validation scenarios working
- Performance targets met (Lighthouse ≥90, bundle <180KB)
- Test coverage targets achieved (≥80% services, 100% E2E)
- Production-ready deployment on Cloudflare Workers

## Next Steps
The project is ready to begin Phase 3.1 (Setup) with task T001: Create project structure. All planning documents are complete and the development workflow is clearly defined.