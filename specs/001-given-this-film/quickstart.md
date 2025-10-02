# Quickstart: HKAFF Screening Selector

**Feature**: 001-given-this-film  
**Date**: 2025-10-02  
**Purpose**: End-to-end validation of the Hong Kong Asian Film Festival Screening Selector

## Prerequisites

- Node.js 18+ installed
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Repository cloned and dependencies installed

## Setup

```bash
# Install dependencies
npm install

# Run data extraction script (one-time)
node scripts/scrapeHKAFF.js

# Verify data files created
ls -la frontend/public/data/
# Should see: films.json, screenings.json, venues.json, categories.json

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## User Journey Validation

### 1. Browse Film Catalogue

**Steps**:
1. Open app in browser
2. Observe film catalogue displays in grid layout
3. Verify each film shows: poster, title, category label

**Expected**:
- ✅ Films load and display (80-100 films visible across pages)
- ✅ Posters render correctly
- ✅ Text is in Traditional Chinese by default
- ✅ Grid is responsive (1 col mobile, 2-3 col desktop)

**Validation**:
```bash
# Check browser console for errors
# Verify network requests:
# - GET /data/films.json (200 OK)
# - GET /data/categories.json (200 OK)
```

---

### 2. Filter Films by Category

**Steps**:
1. Click category dropdown in filter panel
2. Select "開幕電影" (Opening Film)
3. Observe film list updates

**Expected**:
- ✅ Dropdown shows all 15 categories
- ✅ Film list filters to show only Opening Film category
- ✅ Filter updates instantly (<500ms)

**Validation**:
```javascript
// Open browser DevTools console
// Verify filtered array length matches category
console.log('Filtered films:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1).getFiberRoots().values().next().value);
```

---

### 3. Filter Films by Venue

**Steps**:
1. Click venue dropdown
2. Select "百老匯電影中心" (Broadway Cinematheque)
3. Observe films update to show only those screening at Broadway

**Expected**:
- ✅ Dropdown shows all 8 venues
- ✅ Film list updates to show films with screenings at selected venue
- ✅ Multiple filters work together (category + venue)

---

### 4. View Film Details and Select Screening

**Steps**:
1. Click on a film card (e.g., "世外")
2. Film detail modal/page opens
3. View list of available screenings (date, time, venue)
4. Click "Select" button on a specific screening
5. Observe screening added to "My Schedule"

**Expected**:
- ✅ Film details show: synopsis, director, runtime, country
- ✅ All screenings for this film listed with date/time/venue
- ✅ "Select" button changes to "Selected" (visual feedback)
- ✅ Schedule counter increments (+1)

**Validation**:
```javascript
// Check LocalStorage
JSON.parse(localStorage.getItem('hkaff-selections'));
// Should see: { version: 1, selections: [{ screening_id, added_at, ... }], ... }
```

---

### 5. View and Manage Schedule

**Steps**:
1. Navigate to "My Schedule" view
2. Observe screenings grouped by date
3. Within each date, verify sorted by time (ascending)
4. Click "Remove" on a screening
5. Verify screening disappears from schedule

**Expected**:
- ✅ Schedule shows all selected screenings
- ✅ Grouped by date with date headers (e.g., "3月15日")
- ✅ Ordered chronologically within each day
- ✅ Each screening shows: time, film title, venue
- ✅ Remove button instantly updates UI

**Validation**:
```javascript
// Verify schedule structure
const schedule = document.querySelector('[data-testid="schedule-view"]');
const dateGroups = schedule.querySelectorAll('[data-testid="date-group"]');
console.log('Date groups:', dateGroups.length); // Should be >= 1
```

---

### 6. Detect Scheduling Conflicts

**Steps**:
1. In schedule view, select two screenings with overlapping times
   - Example: Film A at 19:30-21:30, Film B at 20:00-22:00
2. Observe conflict warning appears

**Expected**:
- ✅ Warning icon/message displays near conflicting screenings
- ✅ Message explains overlap (e.g., "重疊 30分鐘" or "Overlaps 30 minutes")
- ✅ Both screenings remain in schedule (not blocked)
- ✅ Conflict severity indicated (impossible vs warning)

**Test Cases**:
- **True Overlap**: Screenings at same time → "impossible" severity
- **Tight Timing**: Different venues, <30min gap → "warning" severity
- **Same Venue**: Same venue, <30min gap → OK (no warning)

**Validation**:
```javascript
// Check conflict detection
const conflicts = window.conflictDetector.detectConflicts(selections);
console.log('Detected conflicts:', conflicts);
```

---

### 7. Language Switching

**Steps**:
1. Click language toggle (繁/EN button)
2. Select "EN"
3. Observe all text switches to English

**Expected**:
- ✅ Film titles switch to English
- ✅ UI labels switch to English (e.g., "My Schedule" instead of "我的時間表")
- ✅ Category/venue names switch to English
- ✅ Date formats remain appropriate for language
- ✅ Switch is instant (<100ms)
- ✅ Language preference persists in LocalStorage

**Validation**:
```javascript
// Check language preference
JSON.parse(localStorage.getItem('hkaff-selections')).preferences.language; // "en"
```

---

### 8. Export Schedule to Markdown

**Steps**:
1. In schedule view, click "Export" button
2. Markdown-formatted schedule appears in modal/textarea
3. Click "Copy to Clipboard"
4. Paste into text editor

**Expected Markdown Format**:
```markdown
# My HKAFF 2025 Schedule

## 3月15日 (Friday)

### 19:30 - 世外 (Another World)
- **Venue**: 百老匯電影中心 (Broadway Cinematheque)
- **Duration**: 120 minutes
- **Director**: [Director Name]

### 21:45 - 國寶 (KOKUHO)
- **Venue**: MOViE MOViE Pacific Place
- **Duration**: 110 minutes
- **Director**: [Director Name]

## 3月16日 (Saturday)

### 14:00 - 電競女孩 (Gamer Girls)
...
```

**Validation**:
- ✅ All selected screenings included
- ✅ Grouped by date
- ✅ Times, venues, titles correct
- ✅ Markdown syntax valid
- ✅ Copy to clipboard works

---

### 9. Persistence Across Sessions

**Steps**:
1. With schedule populated, note selected screenings
2. Close browser tab
3. Clear browser cache (but NOT LocalStorage)
4. Open app again in new tab
5. Navigate to "My Schedule"

**Expected**:
- ✅ All selections preserved
- ✅ Schedule displays exactly as before
- ✅ Language preference maintained

**Validation**:
```bash
# Before closing:
localStorage.getItem('hkaff-selections');

# After reopening:
localStorage.getItem('hkaff-selections');
# Should be identical
```

---

### 10. Responsive Design Validation

**Steps**:
1. Resize browser window from desktop (1920px) to mobile (375px)
2. Test all features at different breakpoints:
   - 375px (mobile)
   - 768px (tablet)
   - 1280px (desktop)

**Expected**:
- ✅ Film grid adjusts: 1 col → 2 col → 3-4 col
- ✅ Filter dropdowns stack vertically on mobile
- ✅ Schedule view switches from timeline to cards on mobile
- ✅ Language toggle remains accessible
- ✅ Touch targets >= 44x44px on mobile
- ✅ No horizontal scrolling
- ✅ Text remains readable (min 16px font size)

**Validation**:
```bash
# Use browser DevTools Device Mode
# Test on actual mobile device if available
```

---

## Automated Test Execution

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run contract tests
npm run test:contract

# Generate coverage report
npm run test:coverage
```

**Expected Coverage**:
- Services: ≥80%
- Utilities: ≥80%
- E2E scenarios: 100% (all 7 scenarios pass)

---

## Performance Validation

### Initial Load

**Metrics**:
- Time to First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Bundle Size: <180KB gzipped
- Lighthouse Score: ≥90

**Measurement**:
```bash
# Build for production
npm run build

# Serve production build
npm run preview

# Run Lighthouse in Chrome DevTools
# Performance tab → Generate report
```

### Interaction Performance

**Metrics**:
- Filter update: <500ms
- Screening selection: <100ms
- Language switch: <100ms
- Schedule view render: <500ms for 50 selections

**Measurement**:
```javascript
// Use browser Performance API
performance.mark('filter-start');
// Apply filter
performance.mark('filter-end');
performance.measure('filter-duration', 'filter-start', 'filter-end');
console.log(performance.getEntriesByName('filter-duration')[0].duration);
```

---

## Success Criteria

All validation steps must pass with ✅ for feature completion:

- [ ] All 10 user journey steps validated
- [ ] Automated tests pass (unit + E2E + contract)
- [ ] Performance metrics met
- [ ] Responsive design verified on 3+ devices
- [ ] No console errors or warnings
- [ ] LocalStorage persistence confirmed
- [ ] Markdown export format validated
- [ ] Conflict detection accurate
- [ ] Language switching complete

---

## Troubleshooting

### Films Not Loading
```bash
# Check data files exist
ls frontend/public/data/

# Verify JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('frontend/public/data/films.json')))"

# Check network tab for 404 errors
```

### LocalStorage Not Persisting
```javascript
// Check browser LocalStorage quota
navigator.storage.estimate().then(est => console.log(est));

// Verify storage not disabled
if (typeof(Storage) !== "undefined") {
  console.log("LocalStorage available");
} else {
  console.error("LocalStorage not supported");
}
```

### Conflicts Not Detected
```javascript
// Manually test conflict detector
import { detectConflicts } from './src/services/conflictDetector';
const testSelections = [...]; // Add test data
console.log(detectConflicts(testSelections));
```

---

**Quickstart Version**: 1.0  
**Last Updated**: 2025-10-02
