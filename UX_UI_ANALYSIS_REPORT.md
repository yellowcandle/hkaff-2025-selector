# HKAFF 2025 Screening Selector - UX/UI Analysis Report

**Analysis Date:** October 2, 2025
**Application URL:** https://hkaff-2025-selector.herballemon.workers.dev/
**Analyzed Version:** Production deployment

---

## Executive Summary

The HKAFF 2025 Screening Selector is a well-architected single-page application built with React, TypeScript, and Tailwind CSS. The application demonstrates solid foundational UX principles with bilingual support (English/Traditional Chinese), responsive design, and core functionality for film browsing and schedule management. However, there are several critical UX/UI issues and opportunities for improvement that would significantly enhance the user experience.

**Overall UX Score:** 7.5/10

**Key Strengths:**
- Clean, minimal design with good use of whitespace
- Responsive grid layout for film catalogue
- Bilingual support with persistent language preference
- Effective conflict detection for scheduling
- Solid error boundary implementation

**Critical Issues Found:** 5 P0, 8 P1, 12 P2

---

## 1. Visual Design & Aesthetics

### 1.1 Color Scheme and Contrast

**Strengths:**
- Uses a clean, professional gray-scale palette (gray-50 to gray-900)
- Blue accent color (#2563eb) for interactive elements provides good brand consistency
- Error states use appropriate red (#dc2626) and warning states use yellow (#ca8a04)

**Issues Identified:**

**[P1] Limited Brand Identity**
- **Issue:** The application uses generic Tailwind colors without customization
- **Impact:** Lacks visual differentiation from other Tailwind-based applications
- **Recommendation:** Define a custom color palette that reflects HKAFF branding
  ```javascript
  // Suggested tailwind.config.js extension
  theme: {
    extend: {
      colors: {
        hkaff: {
          primary: '#1a365d',    // Deep blue
          secondary: '#744210',  // Film reel gold
          accent: '#2b6cb0',     // Bright blue
        }
      }
    }
  }
  ```

**[P2] Insufficient Color Contrast in Some Areas**
- **Issue:** Gray-600 text on gray-50 background may not meet WCAG AA standards
- **Location:** Film card category badges, schedule item details
- **Recommendation:** Audit all text/background combinations using contrast checkers
- **Fix:** Use gray-700 or gray-800 for better readability

**[P0] No Visual Feedback for Selected Films**
- **Issue:** When a film has selected screenings, there's no visual indicator on the film card
- **Impact:** Users cannot easily identify which films they've already selected screenings for
- **Recommendation:** Add a badge or border indicator to FilmCard when `selectedScreeningIds` includes any screening for that film

### 1.2 Typography and Readability

**Strengths:**
- Good typographic hierarchy with clear heading sizes (text-xl, text-2xl, text-3xl)
- Appropriate line-height and spacing for body text
- Font weight variations (font-medium, font-semibold, font-bold) create clear hierarchy

**Issues Identified:**

**[P1] No Custom Font Loading**
- **Issue:** Application relies on system fonts which can vary significantly across devices
- **Impact:** Inconsistent visual experience across platforms
- **Recommendation:** Add a web font like Inter or Noto Sans for consistency
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

**[P2] Inconsistent Chinese Typography**
- **Issue:** No specific font-family for Traditional Chinese text
- **Impact:** Chinese characters may render poorly on some systems
- **Recommendation:** Add Noto Sans TC or similar for better Chinese character rendering

**[P2] Film Synopsis Truncation**
- **Issue:** Long synopses in FilmDetail modal can create excessive scrolling
- **Location:** FilmDetail.tsx line 123
- **Recommendation:** Consider a "Read more/Less" toggle for long synopses or limit to 4-5 lines with expand option

### 1.3 Layout and Spacing

**Strengths:**
- Consistent spacing using Tailwind's spacing scale
- Good use of responsive modifiers (sm:, md:, lg:)
- Appropriate container max-width (max-w-7xl) for readability

**Issues Identified:**

**[P0] Filter Panel Dropdown Visibility Issues**
- **Issue:** Filter dropdowns can be cut off on small screens or when near viewport edges
- **Location:** FilterPanel.tsx lines 59-88
- **Impact:** Users may not see all filter options
- **Recommendation:** Implement smart positioning or use a modal-based filter on mobile
  ```tsx
  // Consider using a library like @floating-ui/react for smart positioning
  ```

**[P1] Inconsistent Modal Padding**
- **Issue:** FilmDetail modal (p-6) and MarkdownExportModal (p-6) use same padding, but content feels cramped in FilmDetail
- **Recommendation:** Increase padding to p-8 for FilmDetail header section

**[P2] Grid Gap Not Optimized for Large Screens**
- **Issue:** Film grid uses gap-4 md:gap-6, which feels tight on large displays
- **Recommendation:** Add xl:gap-8 for better visual breathing room on large screens

### 1.4 Visual Hierarchy

**Strengths:**
- Clear primary actions (blue buttons) vs secondary actions (gray/white buttons)
- Good use of shadows to create depth (shadow-sm, shadow-md, shadow-lg)
- Sticky header keeps navigation accessible

**Issues Identified:**

**[P1] Weak Visual Hierarchy in Schedule View**
- **Issue:** Date headers don't stand out enough from screening items
- **Location:** DateGroup component (need to check implementation)
- **Recommendation:** Increase date header size and add subtle background color

**[P0] Missing Visual Separator Between Catalogue and Schedule Views**
- **Issue:** No clear transition when switching between views
- **Recommendation:** Add a slide transition or fade effect when switching views

### 1.5 Brand Consistency

**Issues Identified:**

**[P1] No Logo or Branding Elements**
- **Issue:** Application header only shows text, no visual branding
- **Impact:** Lacks professional polish and brand recognition
- **Recommendation:** Add HKAFF logo to header
  ```tsx
  <div className="flex items-center gap-3">
    <img src="/hkaff-logo.svg" alt="HKAFF" className="h-10 w-auto" />
    <div>
      <h1 className="text-xl font-semibold">...</h1>
      <p className="text-sm">...</p>
    </div>
  </div>
  ```

**[P2] Generic Favicon**
- **Issue:** Uses default Vite favicon (vite.svg)
- **Recommendation:** Replace with HKAFF-branded favicon

---

## 2. User Experience

### 2.1 Navigation Flow

**Strengths:**
- Simple two-view architecture (Catalogue/Schedule) is easy to understand
- View toggle with badge count is intuitive
- Clear back navigation with close buttons on modals

**Issues Identified:**

**[P0] No Deep Linking Support**
- **Issue:** Cannot share direct links to specific films or filtered views
- **Impact:** Users cannot bookmark or share specific states
- **Recommendation:** Implement URL-based routing with query parameters
  ```
  /catalogue?category=opening-films&venue=cultural-centre
  /film/:filmId
  /schedule
  ```

**[P1] Lost Filter State When Switching Views**
- **Issue:** Filters are not preserved when switching from Catalogue to Schedule and back
- **Impact:** Frustrating re-filtering workflow
- **Recommendation:** Persist filter state or show filters in both views

**[P1] No Breadcrumb or Location Indicator**
- **Issue:** When film detail modal is open, no clear indication of current location
- **Recommendation:** Add breadcrumb or location indicator in modal

**[P2] Back Button Doesn't Close Modal**
- **Issue:** Browser back button doesn't close FilmDetail modal
- **Impact:** Breaks expected browser behavior
- **Recommendation:** Implement history API to handle modal state

### 2.2 Information Architecture

**Strengths:**
- Logical grouping: Browse films → Select screenings → View schedule
- Clear categorization with filter options
- Date-grouped schedule view makes sense

**Issues Identified:**

**[P0] No Search Functionality**
- **Issue:** Users cannot search for films by title, director, or keywords
- **Impact:** Difficult to find specific films in large catalogue
- **Recommendation:** Add search input in FilterPanel
  ```tsx
  <input
    type="search"
    placeholder={isZh ? '搜尋電影...' : 'Search films...'}
    className="px-4 py-2 border border-gray-300 rounded-md"
    onChange={handleSearch}
  />
  ```

**[P1] Missing Sort Options**
- **Issue:** Films cannot be sorted (by title, date added, runtime, etc.)
- **Impact:** Users cannot organize catalogue to their preference
- **Recommendation:** Add sort dropdown with options:
  - Title (A-Z / Z-A)
  - Runtime (shortest/longest first)
  - Category

**[P1] No Film Count Indicator**
- **Issue:** Users don't know how many films match current filters
- **Recommendation:** Add count display: "Showing 24 films" or "沒有符合條件的電影 (0/156)"

**[P2] Categories Not Explained**
- **Issue:** Category names may not be self-explanatory to all users
- **Recommendation:** Add tooltip or description on hover

### 2.3 Interaction Patterns

**Strengths:**
- Hover states on interactive elements (hover:bg-gray-50, hover:scale-105)
- Disabled state clearly indicated on selected screenings
- Loading spinner provides feedback during data load

**Issues Identified:**

**[P0] Select Screening Button is Misleading When Selected**
- **Issue:** Button shows "已選擇" / "Selected" but doesn't allow deselection
- **Location:** ScreeningSelector.tsx line 76-77
- **Impact:** Confusing UX - users expect to toggle selection
- **Current Code:**
  ```tsx
  disabled={isSelected}
  className={`... ${isSelected ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : '...'}`}
  ```
- **Recommendation:** Change to toggle button:
  ```tsx
  onClick={() => onSelectScreening(screening)}
  className={`... ${isSelected ? 'bg-red-600 text-white hover:bg-red-700' : '...'}`}
  >
    {isSelected ? (isZh ? '取消選擇' : 'Deselect') : (isZh ? '選擇' : 'Select')}
  ```

**[P0] Clicking Outside Dropdown Doesn't Close It Reliably**
- **Issue:** FilterPanel has backdrop div but z-index may cause issues
- **Location:** FilterPanel.tsx lines 152-160
- **Recommendation:** Verify z-index stacking and test on actual deployment

**[P1] No Confirmation for Remove Screening**
- **Issue:** Delete button removes screening immediately without confirmation
- **Location:** ScheduleView → ScreeningItem remove button
- **Impact:** Accidental deletions frustrating
- **Recommendation:** Add confirmation dialog or undo toast notification

**[P1] Film Card Hover Effect Too Aggressive**
- **Issue:** hover:scale-105 can feel jarring, especially on grids
- **Recommendation:** Reduce to hover:scale-102 or use shadow-only hover effect

**[P2] No Keyboard Shortcuts**
- **Issue:** Power users cannot use keyboard shortcuts for common actions
- **Recommendation:** Add shortcuts:
  - `Esc` to close modals (✓ implemented for FilmDetail)
  - `/` to focus search
  - `c` for Catalogue view, `s` for Schedule view
  - `e` to export from schedule view

**[P2] No Loading States for Individual Actions**
- **Issue:** When selecting/removing screenings, no immediate feedback
- **Recommendation:** Add optimistic UI updates or loading spinners

### 2.4 Mobile Responsiveness

**Strengths:**
- Grid adapts from 1 column (mobile) to 3 columns (desktop)
- Flexible flex-col on mobile, flex-row on desktop throughout
- Sticky header works on mobile

**Issues Identified:**

**[P0] Modal Max Height Issues on Mobile**
- **Issue:** FilmDetail modal uses max-h-[90vh] which may be problematic on mobile with address bars
- **Location:** FilmDetail.tsx line 62
- **Recommendation:** Use dynamic height calculation or test on actual devices
  ```tsx
  className="max-h-screen overflow-y-auto"
  style={{ maxHeight: 'calc(100vh - 2rem)' }}
  ```

**[P0] Touch Targets Too Small**
- **Issue:** Language toggle button (px-3 py-1) is smaller than recommended 44x44px
- **Location:** LanguageToggle.tsx line 19
- **Impact:** Difficult to tap on mobile devices
- **Recommendation:** Increase to px-4 py-2 minimum

**[P1] Filter Dropdowns Not Optimized for Mobile**
- **Issue:** Dropdowns can extend beyond viewport on small screens
- **Recommendation:** Use bottom sheet or full-screen overlay on mobile
  ```tsx
  {isMobile ? (
    <MobileFilterSheet />
  ) : (
    <DesktopDropdown />
  )}
  ```

**[P1] Schedule Export Modal Text Too Small on Mobile**
- **Issue:** Markdown preview uses text-sm which is hard to read on mobile
- **Recommendation:** Use text-base on mobile, text-sm on desktop

**[P2] Horizontal Scrolling on Small Screens**
- **Issue:** Long film titles or venue names may cause overflow
- **Recommendation:** Ensure all text uses line-clamp or overflow-ellipsis

### 2.5 Loading States and Feedback

**Strengths:**
- Clean loading spinner with animation
- Bilingual loading message
- Loading state prevents interaction

**Issues Identified:**

**[P1] No Skeleton Screens**
- **Issue:** Abrupt transition from spinner to full content
- **Recommendation:** Use skeleton loaders for better perceived performance
  ```tsx
  {isLoading ? (
    <SkeletonFilmGrid />
  ) : (
    <FilmList ... />
  )}
  ```

**[P1] No Empty State Illustrations**
- **Issue:** Empty states use basic SVG icons
- **Recommendation:** Use more engaging illustrations for empty states

**[P2] No Progress Indicator for Data Loading**
- **Issue:** Users don't know how long loading will take
- **Recommendation:** If data load is slow, show progress: "Loading films... (2/4 complete)"

**[P2] No Offline Indicator**
- **Issue:** No indication when user is offline
- **Recommendation:** Add offline detection and banner

### 2.6 Error Handling

**Strengths:**
- Error boundary catches React errors
- Error messages are bilingual
- Reload button provided on error

**Issues Identified:**

**[P1] Generic Error Messages**
- **Issue:** Error boundary shows error.message which may be technical
- **Location:** App.tsx line 104
- **Recommendation:** Map error types to user-friendly messages

**[P1] No Error Recovery Beyond Reload**
- **Issue:** Only option is full page reload
- **Recommendation:** Implement retry logic for network errors

**[P2] Image Load Errors Silent**
- **Issue:** FilmCard shows fallback SVG but no user notification
- **Recommendation:** Consider logging or showing subtle indicator for missing posters

---

## 3. Functional UX Issues

### 3.1 Filter Functionality

**Issues Identified:**

**[P0] Cannot Combine Multiple Categories**
- **Issue:** Can only filter by one category at a time
- **Impact:** Users cannot view multiple categories together (e.g., "Opening Films" + "Special Presentations")
- **Recommendation:** Add multi-select capability with checkboxes

**[P0] Filter State Lost on Modal Open**
- **Issue:** Opening film detail doesn't preserve filter context
- **Recommendation:** Keep filters active in background

**[P1] No Date/Time Filters**
- **Issue:** Cannot filter by date range or time of day
- **Impact:** Users planning specific dates must manually scan all films
- **Recommendation:** Add date range picker and time slot filters (morning/afternoon/evening)

**[P1] No "Has Available Screenings" Filter**
- **Issue:** Cannot filter to only show films with future screenings
- **Recommendation:** Add toggle for "Available now" or "Has screenings"

**[P2] Clear Filters Button Not Always Visible**
- **Issue:** Button only appears when filters active (good) but could be more prominent
- **Recommendation:** Consider always showing but disabled when no filters

### 3.2 Schedule Management

**Issues Identified:**

**[P0] No Bulk Actions**
- **Issue:** Cannot select multiple screenings to remove at once
- **Impact:** Tedious to clear schedule or remove multiple items
- **Recommendation:** Add checkbox selection mode with "Remove selected" action

**[P0] Cannot Reorder Schedule**
- **Issue:** Schedule is always chronological; users may want custom order
- **Recommendation:** Add drag-and-drop reordering (optional, can override chronological)

**[P1] No Schedule Filters**
- **Issue:** In schedule view, cannot filter by venue or date
- **Impact:** Hard to review specific venues or dates in large schedules
- **Recommendation:** Add filter chips or dropdown in schedule view

**[P1] No Print-Friendly View**
- **Issue:** Markdown export is good, but no direct print layout
- **Recommendation:** Add print stylesheet or print view

**[P2] No Notes/Comments on Screenings**
- **Issue:** Users cannot add personal notes to selected screenings
- **Recommendation:** Add optional note field to each selection

### 3.3 Conflict Detection Visibility

**Strengths:**
- Conflict detection logic is solid (overlaps and tight timing)
- Visual indicators (warning icon, colored backgrounds)
- Clear severity levels (impossible vs warning)

**Issues Identified:**

**[P0] Conflicts Not Shown at Selection Time**
- **Issue:** Conflicts only visible in Schedule view, not when selecting
- **Impact:** Users add conflicting screenings without realizing
- **Recommendation:** Show conflict preview in FilmDetail modal before selection
  ```tsx
  {hasConflictWithSelection && (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
      <p className="text-yellow-800">
        ⚠️ This screening conflicts with: "Film Title" at 19:00
      </p>
    </div>
  )}
  ```

**[P1] Conflict Resolution Not Offered**
- **Issue:** System shows conflicts but doesn't help resolve them
- **Recommendation:** Add "Replace conflicting screening" or "Show alternatives" options

**[P1] Warning Conflicts Too Subtle**
- **Issue:** Yellow warnings less noticeable than red impossible conflicts
- **Recommendation:** Increase visual prominence or add notification badge

**[P2] No Conflict Summary**
- **Issue:** No overview of total conflicts in schedule
- **Recommendation:** Add summary: "You have 2 impossible conflicts and 3 warnings"

### 3.4 Language Toggle (EN/TC)

**Strengths:**
- Language persists to localStorage
- Clean toggle button design
- Updates HTML lang attribute for accessibility

**Issues Identified:**

**[P1] Language Label Unclear**
- **Issue:** "EN" and "繁" may not be immediately clear to all users
- **Recommendation:** Use more explicit labels or flag icons
  ```tsx
  {isZh ? (
    <span className="flex items-center gap-1">
      🇬🇧 English
    </span>
  ) : (
    <span className="flex items-center gap-1">
      🇭🇰 繁體中文
    </span>
  )}
  ```

**[P2] Language Toggle Not in Footer**
- **Issue:** Only in header; users may expect it in footer too
- **Recommendation:** Add language selector to footer for long pages

**[P2] No Language Auto-Detection**
- **Issue:** Doesn't detect browser language preference on first visit
- **Recommendation:** Use navigator.language as initial fallback

### 3.5 Export Functionality

**Strengths:**
- Markdown export is versatile and developer-friendly
- Both copy and download options
- Date-stamped filenames

**Issues Identified:**

**[P1] No Other Export Formats**
- **Issue:** Only Markdown available; users may want PDF, iCal, or CSV
- **Impact:** Limited sharing and integration options
- **Recommendation:** Add export format selector:
  - **PDF** - for printing
  - **iCal** - for calendar apps
  - **CSV** - for spreadsheet analysis
  - **JSON** - for developer use

**[P1] Export Content Not Customizable**
- **Issue:** Exports all selections; cannot choose subset
- **Recommendation:** Add checkboxes to select which screenings to export

**[P2] No Share Functionality**
- **Issue:** Cannot generate shareable link for schedule
- **Recommendation:** Add "Share schedule" that creates unique URL

**[P2] Markdown Preview Not Rendered**
- **Issue:** Shows raw markdown instead of rendered preview
- **Recommendation:** Add toggle between raw/rendered view

### 3.6 Offline Capabilities

**Issues Identified:**

**[P0] No Service Worker**
- **Issue:** Application doesn't work offline at all
- **Impact:** Users lose access if connection drops
- **Recommendation:** Implement service worker with Workbox
  ```javascript
  // vite-plugin-pwa configuration
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,json}']
    }
  })
  ```

**[P0] No Offline Data Persistence Strategy**
- **Issue:** LocalStorage used but no offline-first approach
- **Recommendation:** Use IndexedDB for data caching with stale-while-revalidate

**[P1] No Install Prompt (PWA)**
- **Issue:** Cannot install as PWA for app-like experience
- **Recommendation:** Add PWA manifest and install prompt

---

## 4. Accessibility

### 4.1 Color Contrast Ratios

**Issues Identified:**

**[P0] Insufficient Contrast on Category Badges**
- **Issue:** Blue-100 background with blue-800 text may not meet WCAG AA
- **Location:** FilmCard.tsx line 50
- **Test Result:** Needs verification with contrast checker
- **Recommendation:** Use blue-700 text or blue-200 background

**[P1] Gray Text Contrast Issues**
- **Issue:** Multiple instances of gray-600 on gray-50 or white
- **Recommendation:** Audit all text colors and ensure 4.5:1 minimum ratio

### 4.2 Touch Target Sizes

**Issues Identified:**

**[P0] Multiple Touch Targets Below 44x44px**
- **Locations:**
  - Language toggle button
  - Close modal buttons (40x40px)
  - Remove screening button (icon only)
- **Recommendation:** Increase padding to ensure 44x44px minimum
  ```tsx
  // Minimum size
  className="p-3" // Results in ~44px with icon
  ```

### 4.3 Keyboard Navigation

**Strengths:**
- ESC key closes FilmDetail modal
- Buttons are focusable by default

**Issues Identified:**

**[P0] Filter Dropdowns Not Keyboard Accessible**
- **Issue:** Custom dropdowns don't support keyboard navigation (Arrow keys, Enter, Escape)
- **Location:** FilterPanel.tsx
- **Recommendation:** Replace with native <select> or add full keyboard support
  - Arrow up/down to navigate options
  - Enter to select
  - Escape to close

**[P0] Modal Focus Trap Not Implemented**
- **Issue:** Tab can navigate to elements behind modal
- **Recommendation:** Implement focus trap with focus-trap-react library

**[P1] No Skip to Main Content Link**
- **Issue:** Keyboard users must tab through header navigation
- **Recommendation:** Add skip link:
  ```tsx
  <a href="#main" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>
  ```

**[P1] No Visible Focus Indicators in Some Components**
- **Issue:** Default focus outline may be suppressed by Tailwind reset
- **Recommendation:** Add consistent focus styles:
  ```css
  .focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2;
  }
  ```

### 4.4 Screen Reader Support

**Strengths:**
- Good use of aria-label on language toggle
- Semantic HTML (header, main)

**Issues Identified:**

**[P0] Missing ARIA Labels on Key Interactive Elements**
- **Locations:**
  - Filter dropdowns need aria-expanded, aria-haspopup
  - Remove buttons need descriptive labels (currently generic)
  - View toggle buttons need aria-pressed
- **Recommendation:**
  ```tsx
  <button
    aria-label={`Remove ${filmTitle} screening at ${time}`}
    aria-pressed={currentView === 'catalogue'}
  >
  ```

**[P0] Modal Not Announced to Screen Readers**
- **Issue:** FilmDetail modal needs role="dialog" and aria-labelledby
- **Recommendation:**
  ```tsx
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="film-title"
  >
    <h2 id="film-title">{title}</h2>
  ```

**[P1] Loading State Not Announced**
- **Issue:** Loading spinner has no aria-live region
- **Recommendation:**
  ```tsx
  <div role="status" aria-live="polite">
    <span className="sr-only">Loading...</span>
  ```

**[P1] Conflict Warnings Not Emphasized**
- **Issue:** Screen readers may not convey urgency of conflicts
- **Recommendation:** Add role="alert" for impossible conflicts

**[P2] No Landmark Regions**
- **Issue:** Missing nav, main, aside landmarks
- **Recommendation:** Add appropriate ARIA landmarks

### 4.5 ARIA Labels

**Issues Identified:**

**[P0] Form Controls Missing Labels**
- **Issue:** Filter dropdowns are buttons, not proper form controls
- **Recommendation:** Add hidden labels or aria-label

**[P1] Dynamic Content Not Announced**
- **Issue:** Filter changes, selection additions not announced
- **Recommendation:** Use aria-live regions for dynamic updates

---

## 5. Performance & Polish

### 5.1 Loading Performance

**Strengths:**
- Client-side data loading from JSON files
- React.StrictMode for development checks
- Vite build optimization

**Issues Identified:**

**[P0] No Code Splitting**
- **Issue:** Entire app loads as single bundle
- **Impact:** Slow initial load, especially on mobile
- **Recommendation:** Implement route-based code splitting
  ```tsx
  const ScheduleView = lazy(() => import('./components/ScheduleView/ScheduleView'))
  ```

**[P0] No Image Optimization**
- **Issue:** Film posters loaded at full resolution
- **Impact:** Large data transfer, slow rendering
- **Recommendation:**
  - Use responsive images with srcset
  - Implement lazy loading for images below fold
  - Consider image CDN with automatic optimization

**[P1] Data Loaded on Every Visit**
- **Issue:** No caching strategy for films/venues/categories data
- **Recommendation:** Cache API responses with stale-while-revalidate
  ```typescript
  const cachedData = await caches.match(url)
  if (cachedData) return cachedData
  ```

**[P1] Large Bundle Size**
- **Issue:** date-fns entire library imported
- **Recommendation:** Use date-fns-tz and import only needed functions
  ```typescript
  import { format, parseISO } from 'date-fns'
  ```

**[P2] No Resource Hints**
- **Issue:** index.html doesn't preload critical resources
- **Recommendation:** Add preconnect, preload hints
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" as="fetch" href="/data/films.json">
  ```

### 5.2 Animation Smoothness

**Strengths:**
- CSS transitions on hover states
- Tailwind transition utilities used consistently

**Issues Identified:**

**[P1] No Motion Preference Respect**
- **Issue:** Animations don't respect prefers-reduced-motion
- **Recommendation:** Add media query check
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

**[P2] No Page Transition Animations**
- **Issue:** Abrupt switches between Catalogue and Schedule views
- **Recommendation:** Add fade or slide transitions

**[P2] Modal Enter/Exit Not Animated**
- **Issue:** Modals appear/disappear instantly
- **Recommendation:** Add fade-in animation using framer-motion or CSS animations

### 5.3 Image Optimization

**Issues Identified:**

**[P0] No Progressive Image Loading**
- **Issue:** Images load full-size immediately or not at all
- **Recommendation:** Implement progressive JPEG or blur placeholder technique

**[P0] Missing Alt Text Strategy**
- **Issue:** Alt text is just film title
- **Recommendation:** More descriptive alt text: `alt={`${title} - ${category} film poster`}`

**[P1] No WebP/AVIF Format Support**
- **Issue:** Using only JPG/PNG
- **Recommendation:** Serve modern image formats with fallbacks
  ```html
  <picture>
    <source srcset="poster.avif" type="image/avif">
    <source srcset="poster.webp" type="image/webp">
    <img src="poster.jpg" alt="...">
  </picture>
  ```

### 5.4 Bundle Size Impact on UX

**Current Analysis:**
- React + ReactDOM: ~140KB (gzipped)
- i18next + react-i18next: ~40KB
- date-fns: ~20-30KB (with tree-shaking)
- Tailwind CSS: ~10-15KB (purged)
- **Estimated Total:** ~220-230KB gzipped

**Issues Identified:**

**[P1] No Bundle Analysis**
- **Recommendation:** Add rollup-plugin-visualizer to identify large dependencies

**[P2] Potential Over-bundling**
- **Recommendation:** Audit dependencies for lighter alternatives

### 5.5 Polish Items

**Issues Identified:**

**[P1] No Micro-interactions**
- **Issue:** Basic interactions lack polish (checkbox animations, success confirmations)
- **Recommendation:** Add subtle animations for state changes

**[P1] No Toast Notifications**
- **Issue:** Success/error states not communicated with toasts
- **Recommendation:** Add toast library (react-hot-toast) for feedback

**[P2] No Contextual Help**
- **Issue:** No tooltips or help text for features
- **Recommendation:** Add tooltip system for first-time users

**[P2] No Loading Percentage**
- **Issue:** Data loading shows spinner but no progress
- **Recommendation:** Show progress if data load is split into chunks

---

## 6. Critical Issues & Recommendations

### Priority 0 (Critical - Must Fix)

1. **No Search Functionality**
   - **Severity:** Critical
   - **User Impact:** Very High
   - **Effort:** Medium
   - **Fix:** Add search input with fuzzy matching on film title, director

2. **Select Screening Button Misleading**
   - **Severity:** Critical
   - **User Impact:** High
   - **Effort:** Low
   - **Fix:** Change disabled button to toggle deselect button

3. **Conflicts Not Shown at Selection Time**
   - **Severity:** Critical
   - **User Impact:** High
   - **Effort:** Medium
   - **Fix:** Add conflict preview in FilmDetail modal

4. **No Deep Linking/URL Routing**
   - **Severity:** Critical
   - **User Impact:** High
   - **Effort:** High
   - **Fix:** Implement React Router with query params

5. **Filter Dropdowns Not Keyboard Accessible**
   - **Severity:** Critical (Accessibility)
   - **User Impact:** Very High (for keyboard users)
   - **Effort:** Medium
   - **Fix:** Add keyboard event handlers or use accessible dropdown library

6. **Modal Focus Trap Not Implemented**
   - **Severity:** Critical (Accessibility)
   - **User Impact:** High
   - **Effort:** Low
   - **Fix:** Add focus-trap-react

7. **Missing ARIA Labels and Roles**
   - **Severity:** Critical (Accessibility)
   - **User Impact:** Very High (for screen reader users)
   - **Effort:** Low-Medium
   - **Fix:** Add proper ARIA attributes throughout

8. **No Code Splitting**
   - **Severity:** Critical (Performance)
   - **User Impact:** High (slow initial load)
   - **Effort:** Low
   - **Fix:** Use React.lazy for route components

9. **No Image Optimization**
   - **Severity:** Critical (Performance)
   - **User Impact:** High
   - **Effort:** Medium
   - **Fix:** Implement lazy loading and responsive images

10. **Touch Targets Too Small**
    - **Severity:** Critical (Mobile UX)
    - **User Impact:** High
    - **Effort:** Low
    - **Fix:** Increase button padding to meet 44x44px minimum

### Priority 1 (Important - Should Fix)

1. **No Export Format Options**
   - Add PDF, iCal, CSV exports

2. **No Sort Options**
   - Add sort by title, runtime, category

3. **Missing Date/Time Filters**
   - Add date range and time-of-day filters

4. **No Bulk Actions in Schedule**
   - Add multi-select and bulk remove

5. **Limited Brand Identity**
   - Customize color palette and add branding

6. **No Skeleton Screens**
   - Replace loading spinner with skeleton loaders

7. **Generic Error Messages**
   - Provide user-friendly, actionable error messages

8. **No Custom Font Loading**
   - Add consistent web fonts

### Priority 2 (Nice to Have - Could Fix)

1. **No Keyboard Shortcuts**
   - Add power user shortcuts

2. **No Print-Friendly View**
   - Add print stylesheet

3. **Missing Categories Descriptions**
   - Add tooltips for category explanations

4. **No Motion Preference Respect**
   - Honor prefers-reduced-motion

5. **Generic Favicon**
   - Add custom HKAFF favicon

6. **Film Synopsis Truncation**
   - Add read more/less toggle

7. **No WebP/AVIF Support**
   - Serve modern image formats

---

## 7. Recommended Implementation Roadmap

### Phase 1: Critical Accessibility & UX Fixes (Week 1-2)
- Add ARIA labels and keyboard navigation to filters
- Implement modal focus trap
- Fix touch target sizes
- Add search functionality
- Make screening selection toggleable

### Phase 2: Performance Optimization (Week 2-3)
- Implement code splitting
- Add image lazy loading and optimization
- Set up service worker for offline support
- Bundle size optimization

### Phase 3: Feature Enhancements (Week 3-4)
- Add URL routing and deep linking
- Implement conflict detection in film detail
- Add sort and additional filter options
- Export format options (PDF, iCal)

### Phase 4: Polish & Brand (Week 4-5)
- Custom color palette and branding
- Skeleton screens and loading states
- Toast notifications
- Micro-interactions and animations
- Tooltip system

### Phase 5: Advanced Features (Week 5-6)
- Bulk actions
- Notes on screenings
- Share functionality
- PWA installation
- Keyboard shortcuts

---

## 8. Conclusion

The HKAFF 2025 Screening Selector demonstrates solid foundational UX/UI work with clean design, responsive layout, and core functionality. However, several critical issues in accessibility, performance, and user experience prevent it from reaching its full potential.

**Top 3 Priorities:**

1. **Accessibility Compliance** - Add proper ARIA labels, keyboard navigation, and focus management to ensure the app is usable by all users

2. **Search & Filtering** - Implement search functionality and enhanced filters to help users find films efficiently in a large catalogue

3. **Performance Optimization** - Add code splitting, image optimization, and offline support to improve load times and usability

Addressing the P0 and P1 issues outlined in this report will transform this from a functional application into a polished, accessible, and high-performing user experience that festival-goers will genuinely enjoy using.

**Estimated Total Effort:** 5-6 weeks with 1-2 developers

---

## Appendix A: Testing Recommendations

### Recommended Testing Tools:
- **Accessibility:** axe DevTools, WAVE, NVDA/JAWS screen readers
- **Performance:** Lighthouse, WebPageTest, Bundle Analyzer
- **Cross-browser:** BrowserStack for Safari, Firefox, Edge testing
- **Mobile:** Physical device testing (iOS Safari, Android Chrome)
- **Visual Regression:** Percy or Chromatic

### Key Test Scenarios:
1. Complete user journey: Browse → Filter → Select → Review schedule → Export
2. Conflict detection with multiple overlapping screenings
3. Language switching with data persistence
4. Offline mode and reconnection
5. Keyboard-only navigation
6. Screen reader navigation
7. Mobile viewport at 320px, 375px, 768px, 1024px

---

## Appendix B: Code Examples

### Example 1: Accessible Filter Dropdown

```tsx
// FilterDropdown.tsx - Accessible implementation
import { useState, useRef, useEffect } from 'react';

export const FilterDropdown = ({ options, selected, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const handleKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          onChange(options[focusedIndex].id);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="filter-label"
        className="w-full px-4 py-2 border rounded-md"
      >
        <span id="filter-label" className="sr-only">{label}</span>
        {selected?.name || 'Select...'}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby="filter-label"
          className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={selected?.id === option.id}
              className={`px-4 py-2 cursor-pointer ${
                focusedIndex === index ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Example 2: Image Optimization Component

```tsx
// OptimizedImage.tsx
import { useState, useEffect } from 'react';

export const OptimizedImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create low-quality placeholder
    const placeholder = 'data:image/svg+xml,...'; // Blur or solid color
    setImageSrc(placeholder);

    // Load actual image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
```

### Example 3: Conflict Detection Preview

```tsx
// Add to FilmDetail.tsx
const [conflictPreview, setConflictPreview] = useState<ConflictInfo[]>([]);

// When screening is hovered or focused
const checkConflictPreview = (screening: Screening) => {
  const conflicts = conflictDetector.detectConflicts(
    [...selections, createTempSelection(screening)]
  );
  setConflictPreview(conflicts.filter(c =>
    c.screening_ids.includes(screening.id)
  ));
};

// In ScreeningSelector
{conflictPreview.length > 0 && (
  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
    <p className="text-sm font-medium text-yellow-800">
      ⚠️ {isZh ? '選擇此場次將產生衝突：' : 'Selecting this screening will create conflicts:'}
    </p>
    {conflictPreview.map((conflict, idx) => (
      <p key={idx} className="text-xs text-yellow-700 mt-1">
        {isZh ? conflict.message_tc : conflict.message_en}
      </p>
    ))}
  </div>
)}
```

---

**Report Prepared By:** UX/UI Design Specialist
**Analysis Method:** Static code analysis, design review, accessibility audit, performance analysis
**Tools Used:** Manual code review, WCAG guidelines reference, performance best practices

---
