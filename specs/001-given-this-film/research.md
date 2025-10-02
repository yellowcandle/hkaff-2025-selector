# Research: Hong Kong Asian Film Festival Screening Selector

**Date**: 2025-10-02  
**Feature**: 001-given-this-film

## Research Areas & Decisions

### 1. HKAFF Data Extraction Strategy

**Decision**: Web scraping with Playwright/Puppeteer to extract structured data from HKAFF website

**Rationale**:
- Website uses server-rendered HTML with structured markup (select dropdowns, film detail pages)
- Venue IDs (36-43) and Section IDs (67-81) visible in HTML select options
- Film data accessible via detail pages (/tc/film/2025/detail/{id})
- Schedule page (/tc/schedule/2025) likely contains screening times
- Bilingual content already separated by URL (/tc vs /en routes)

**Implementation Notes**:
- Scrape venue list from `/tc/film/2025` select dropdown (8 venues: Broadway Cinematheque, PREMIERE ELEMENTS, MOViE MOViE Pacific Place, MOViE MOViE Cityplaza, GALA CINEMA, PALACE ifc, MY CINEMA YOHO MALL, B+ cinema apm)
- Scrape category list from section dropdown (15 categories: Opening Film, Mystery Screening, Closing Film, Special Presentations, etc.)
- Scrape film list from paginated catalogue (7 pages visible)
- Extract film details from individual film pages (/tc/film/2025/detail/{id})
- Extract screening times from `/tc/schedule/2025` page
- Repeat for English (/en) routes
- Output to JSON files: films.json, screenings.json, venues.json, categories.json

**Alternatives Considered**:
- Manual data entry: Rejected due to ~80-100 films with multiple screenings (error-prone, time-consuming)
- Contact HKAFF for data export: Rejected (no API mentioned, turnaround time uncertain)
- Reverse-engineer internal API: Rejected (site appears to use server-side rendering, no obvious JSON endpoints)

**Tools**: Playwright (headless browser automation, handles dynamic JS, robust)

---

### 2. Frontend Framework Selection

**Decision**: React 18+ with Vite

**Rationale**:
- **React**: Mature ecosystem, excellent i18n support (react-i18next), large component library availability
- **Vite**: Fast dev server (<500ms HMR), optimized production builds, built-in TypeScript support
- **Component reusability**: FilmList, ScheduleView, FilterPanel can be isolated and tested
- **Performance**: Virtual DOM efficient for filtering ~100 films, minimal re-renders with proper memoization
- **Developer experience**: Hot reload, clear error messages, extensive documentation

**Alternatives Considered**:
- **Vue 3**: Similar capabilities, but React has better TypeScript integration and more third-party libraries for film/schedule UIs
- **Svelte**: Smaller bundle size (~20% reduction), but less mature i18n ecosystem and fewer date/time utility integrations
- **Vanilla JS**: Maximum performance, but significant development overhead for state management and component isolation

**Bundle Size Target**: <150KB gzipped (React + dependencies + app code)

---

### 3. Internationalization (i18n) Strategy

**Decision**: react-i18next with JSON translation files

**Rationale**:
- Industry standard for React i18n (6M+ weekly downloads)
- Language switching without page reload (requirement from spec)
- Supports nested translations for organized structure
- Interpolation for dynamic content (film titles, dates)
- Small footprint (~15KB gzipped)
- LocalStorage integration to persist language preference

**Implementation**:
```
public/locales/
├── tc/
│   ├── common.json       # UI labels, buttons, headers
│   ├── films.json        # Film titles, synopses (from scraped data)
│   └── venues.json       # Venue names (from scraped data)
└── en/
    ├── common.json
    ├── films.json
    └── venues.json
```

**Alternatives Considered**:
- **react-intl (FormatJS)**: More features (number/date formatting), but heavier bundle (~50KB) and overkill for simple text switching
- **Custom solution**: Lightweight, but reinventing wheel for pluralization, fallback languages, lazy loading

---

### 4. Date/Time Library Selection

**Decision**: date-fns (v3)

**Rationale**:
- **Modular imports**: Tree-shaking reduces bundle size (only import needed functions like `isBefore`, `format`, `parseISO`)
- **Functional API**: Pure functions, easy to test
- **No timezone needed**: Screenings are local HK times, no TZ conversions required
- **Conflict detection**: `areIntervalsOverlapping({ start, end }, { start, end })` built-in
- **Small footprint**: ~10KB gzipped for typical usage (vs 70KB for Moment.js)
- **TypeScript support**: First-class TS definitions

**Key Functions**:
- `parseISO()`: Parse ISO 8601 strings from JSON data
- `format()`: Display times in user-friendly format (e.g., "3月15日 19:30")
- `isSameDay()`: Group screenings by date
- `compareAsc()`: Sort screenings chronologically
- `areIntervalsOverlapping()`: Detect conflicts

**Alternatives Considered**:
- **Day.js**: Smaller (2KB), but less comprehensive API (no `areIntervalsOverlapping`)
- **Luxon**: Better timezone support, but heavier (25KB) and timezone features not needed
- **Moment.js**: Legacy, deprecated, massive bundle size (70KB)

---

### 5. LocalStorage Persistence Strategy

**Decision**: Versioned JSON schema with migration support

**Schema**:
```json
{
  "version": 1,
  "lastUpdated": "2025-10-02T14:30:00Z",
  "selections": [
    {
      "screeningId": "screening-123",
      "addedAt": "2025-10-02T14:30:00Z",
      "film": { /* denormalized film data */ },
      "screening": { /* denormalized screening data */ }
    }
  ],
  "preferences": {
    "language": "tc"
  }
}
```

**Rationale**:
- **Versioning**: Handle schema changes in future iterations
- **Denormalized data**: Store full film/screening details to survive external data updates
- **Timestamps**: Track when selections were made for potential analytics
- **Language persistence**: Remember user's language preference
- **Size limit**: ~5MB LocalStorage limit = ~5000+ selections (far exceeds festival size)

**Migration Strategy**:
```javascript
// Load from localStorage
const data = JSON.parse(localStorage.getItem('hkaff-selections'));
if (!data || data.version < CURRENT_VERSION) {
  migrateData(data); // Transform old schema to new
}
```

**Alternatives Considered**:
- **SessionStorage**: Lost on browser close (violates spec requirement for persistence)
- **IndexedDB**: Overkill for simple key-value storage, async complexity
- **Cookies**: 4KB limit too small, sent with every request (unnecessary)

---

### 6. Responsive Design Approach

**Decision**: Mobile-first CSS with Tailwind CSS utility classes

**Rationale**:
- **Mobile-first**: Start with 320px layout, progressively enhance for tablets/desktop
- **Tailwind**: Utility-first CSS reduces custom CSS, consistent spacing/sizing, tree-shaking for small bundle
- **Breakpoints**: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- **Component variants**: `FilmList` switches from cards (mobile) to table (desktop)

**Key Responsive Patterns**:
- **Film catalogue**: Grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- **Filter panel**: Stacked dropdowns (mobile) → horizontal row (desktop)
- **Schedule view**: Scrollable cards (mobile) → fixed timeline (desktop)
- **Language toggle**: Floating button (mobile) → header link (desktop)

**Alternatives Considered**:
- **Bootstrap**: Heavier framework (50KB), less customizable
- **Pure CSS**: Maximum control, but inconsistent spacing and time-consuming

---

### 7. Testing Strategy

**Decision**: Vitest (unit) + Playwright (E2E)

**Rationale**:
- **Vitest**: Vite-native, instant startup, compatible with Jest API (familiar)
- **Playwright**: Cross-browser (Chromium, Firefox, WebKit), built-in test fixtures, screenshot/video recording
- **Coverage target**: 80%+ for services (storageService, conflictDetector), 100% for E2E user scenarios

**Test Distribution**:
- **Unit tests** (~15 files): Services, utilities, date helpers
- **Component tests** (~8 files): Isolated component behavior (filtering, selection toggling)
- **E2E tests** (~7 scenarios): Full user journeys from spec

**Alternatives Considered**:
- **Jest**: Slower startup (no Vite integration), requires Babel config
- **Cypress**: Good E2E tool, but Playwright has better multi-browser support and faster execution

---

## Summary of Technical Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Data Extraction | Playwright scraping | Automated, bilingual, structured output |
| Frontend Framework | React 18 + Vite | Fast HMR, mature ecosystem, TypeScript support |
| i18n | react-i18next | Industry standard, small bundle, instant switching |
| Date/Time | date-fns v3 | Modular, tree-shakable, built-in conflict detection |
| Persistence | LocalStorage + versioned JSON | Simple, sufficient capacity, migration-ready |
| Responsive Design | Tailwind CSS | Utility-first, mobile-first, small bundle |
| Testing | Vitest + Playwright | Fast unit tests, cross-browser E2E |

**Total Estimated Bundle Size**: ~180KB gzipped (within target for fast load on 3G)

---

**All NEEDS CLARIFICATION resolved**. Ready for Phase 1 design.
