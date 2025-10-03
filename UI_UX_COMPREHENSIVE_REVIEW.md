# HKAFF 2025 Screening Selector - Comprehensive UI/UX Design Review

**Review Date:** October 3, 2025  
**Application URL:** https://hkaff2025.herballemon.dev/  
**Reviewer:** Senior UI/UX Design Expert

---

## Executive Summary

The HKAFF 2025 Screening Selector demonstrates solid foundational UX with clear information architecture and functional bilingual support. The application successfully enables users to browse films, manage schedules, and navigate between different viewing modes. However, significant opportunities exist to enhance visual hierarchy, improve interaction patterns, strengthen accessibility, and elevate the overall aesthetic to match modern film festival standards.

**Overall Grade: B-** (Functional but needs design refinement)

---

## Design Review

### 1. Overall Summary

The application presents a serviceable but visually austere interface that prioritizes functionality over aesthetics. The three-view structure (Catalogue, Schedule, Modern Scheduler) provides flexibility, and the bilingual implementation is comprehensive. However, the design lacks the polish, visual appeal, and emotional engagement expected of a premium film festival experience. The interface feels more like a functional database than an invitation to explore cinema.

**Key Observations:**
- Clean, minimalist approach that borders on sparse
- Strong functional foundation with room for visual enhancement
- Good information architecture undermined by weak visual hierarchy
- Responsive but not optimized for mobile experience
- Accessibility features present but incomplete

---

### 2. Key Strengths

- **Clear Navigation Structure:** Three distinct views (Catalogue, Schedule, Modern Scheduler) provide different browsing paradigms effectively
- **Bilingual Implementation:** Comprehensive Traditional Chinese/English switching works seamlessly across all interface elements
- **Real-time Feedback:** Toast notifications confirm user actions (screening added/removed)
- **Persistent State:** Selected screenings maintain state across view changes
- **Search & Filter Functionality:** Multiple filtering options (category, venue, date) with live search
- **Export Capability:** Markdown export for schedule planning
- **Skip Link:** Accessibility consideration with skip-to-content link
- **Semantic HTML:** Proper use of ARIA roles for tabs and interactive elements
- **Performance:** Fast load times (LCP: 261ms) with minimal page weight

---

### 3. Actionable Recommendations

#### **[CRITICAL PRIORITY] Visual Hierarchy & Design System**

**Observation:** The application suffers from weak visual hierarchy, with nearly all elements sharing similar visual weight. Film cards, filters, and navigation blend together, making it difficult to scan and find key information quickly.

**Impact:**
- Users cannot quickly identify primary actions or important content
- Cognitive load increases as users must read every element to understand importance
- The film browsing experience feels flat and uninspiring
- Professional credibility of the festival brand is undermined

**Suggestions:**

1. **Establish a Clear Typography Scale**
   - Implement a modular type scale (e.g., 14px, 16px, 20px, 24px, 32px, 48px)
   - Current H1 (32px) is too small for a primary heading
   - Film titles in cards (H3) need greater prominence
   - Body text needs better contrast between primary and secondary information
   - **Reference:** [Type Scale](https://typescale.com/) - Use a 1.250 (Major Third) or 1.333 (Perfect Fourth) ratio

2. **Redesign Film Cards with Visual Depth**
   - Add subtle shadows or borders to create card elevation
   - Increase poster image size and prominence (currently too small)
   - Implement hover states with scale/shadow effects
   - Use color-coded category badges instead of text-only labels
   - Add visual indicators for selected/bookmarked films
   - **Reference:** [Material Design Cards](https://m3.material.io/components/cards) - See elevated card patterns

3. **Create a Color System Beyond Grayscale**
   - Current palette is too monochromatic (black text, gray backgrounds)
   - Introduce brand colors for:
     - Primary actions (e.g., "Select screening" buttons)
     - Category indicators (different colors per film category)
     - Status indicators (selected vs. available)
     - Interactive states (hover, focus, active)
   - **Suggestion:** Use a film-inspired palette:
     - Deep cinematic reds/burgundy for primary actions
     - Gold/amber for highlights and selected states
     - Warm grays instead of cold grays for backgrounds
     - Dark navy or charcoal for text (better than pure black)
   - **Reference:** [Coolors](https://coolors.co/) - Generate accessible palettes

4. **Implement Proper Spacing System**
   - Use a consistent spacing scale (8px base: 8, 16, 24, 32, 48, 64)
   - Increase padding around content areas
   - Add more breathing room between film cards
   - Improve separation between filter section and content

---

#### **[CRITICAL PRIORITY] Film Cards & Information Design**

**Observation:** Film cards present information in a cramped, text-heavy format that makes quick scanning difficult. Critical information like screening times is buried in secondary text.

**Impact:**
- Users cannot quickly assess film options
- Poster images are underutilized despite being the most recognizable element
- Time/venue information lacks visual priority
- The browsing experience feels laborious rather than enjoyable

**Suggestions:**

1. **Restructure Card Layout**
   - **Recommended Layout:**
     ```
     ┌─────────────────────────────┐
     │   [Larger Poster Image]     │  ← 16:9 or 2:3 aspect ratio
     │                             │
     ├─────────────────────────────┤
     │ Film Title (Larger, Bold)   │  ← 20-24px
     │ ⭐ Category Badge           │  ← Color-coded
     │                             │
     │ Synopsis (2 lines max)      │  ← Truncate with ellipsis
     │                             │
     │ 📍 Venue • 🕐 Duration     │  ← Icons for scanability
     │ 🎬 Screening Count          │
     │                             │
     │ [View Details Button]       │  ← Clear CTA
     └─────────────────────────────┘
     ```

2. **Visual Indicators for Key Information**
   - Use icons for venue, duration, language
   - Add screening count badge ("5 screenings available")
   - Show earliest/next available screening prominently
   - Display language/subtitle info with flag icons

3. **Progressive Disclosure**
   - Show essential info on card
   - Reveal full screening list on hover/expand
   - Keep synopsis brief (2 lines with "read more")

---

#### **[HIGH PRIORITY] Modal/Film Detail Experience**

**Observation:** The film detail modal presents information in a vertical list format with poor visual hierarchy. Screening selection buttons lack visual differentiation from disabled states.

**Impact:**
- Users struggle to compare screening times quickly
- Selected vs. available states are not immediately obvious
- The modal feels like a simple overlay rather than an immersive detail view
- Missing opportunity to showcase film aesthetics

**Suggestions:**

1. **Redesign Modal Layout**
   - **Recommended Structure:**
     ```
     ┌────────────────────────────────────────┐
     │  [X Close]                             │
     ├────────────┬───────────────────────────┤
     │            │  Film Title (Large)       │
     │            │  Director • Country       │
     │  Poster    │  Duration • Category      │
     │  Image     │                           │
     │  (Larger)  │  Synopsis (Full)          │
     │            │                           │
     │            │  ──────────────────────   │
     │            │  SCREENINGS               │
     │            │  ┌─────────────────────┐  │
     │            │  │ Date/Time • Venue   │  │
     │            │  │ [Select] / [Added✓] │  │
     │            │  └─────────────────────┘  │
     └────────────┴───────────────────────────┘
     ```

2. **Improve Screening Selection UI**
   - Group screenings by date with clear date headers
   - Use cards or bordered sections for each screening
   - Make selection buttons more prominent:
     - **Available:** Primary color button "Select This Screening"
     - **Selected:** Success color with checkmark "Added to Schedule ✓"
     - **Disabled:** Gray with lock icon "Unavailable"
   - Add visual feedback on hover (button grows/highlights)

3. **Enhanced Visual Design**
   - Backdrop blur effect behind modal
   - Larger, higher-quality poster images
   - Use film poster's dominant color as accent in modal
   - Add metadata icons for quick scanning
   - Display trailer/teaser thumbnails if available

---

#### **[HIGH PRIORITY] Navigation & Tab System**

**Observation:** The tab navigation uses minimal styling that makes the selected state unclear. The tab labels don't effectively communicate value ("Catalogue view" vs. just "Films").

**Impact:**
- Users may not realize they're on a specific view
- Navigation between views feels utilitarian
- Missed opportunity to guide users toward optimal workflows

**Suggestions:**

1. **Improve Tab Visual Design**
   - Current: Gray background, black text (minimal differentiation)
   - **Recommended:**
     - Selected: White background, shadow, bottom border accent
     - Unselected: Transparent background, muted text
     - Hover: Subtle background color shift
     - Add icons to tabs for visual recognition
     - Increase tab height for better touch targets (min 48px)

2. **Rename Tabs for Clarity**
   - "Catalogue view" → "Browse Films" (with grid icon 📋)
   - "My Schedule, X selected" → "My Schedule (X)" (with calendar icon 📅)
   - "Modern Scheduler view" → "Timeline View" (with timeline icon 📊)

3. **Add Contextual Guidance**
   - First-time users: Show tooltip "Start here to browse films"
   - Empty schedule state: Prompt "Add films to build your schedule"
   - Selected items indicator: Badge on "My Schedule" tab

---

#### **[HIGH PRIORITY] Filter & Search Experience**

**Observation:** Filters are presented as dropdown buttons that require clicking to see options. The search bar lacks visual prominence. No indication of active filters or result counts.

**Impact:**
- Users don't know what filtering options exist without exploring
- Active filters are not obvious, leading to confusion about why results changed
- Search functionality feels like an afterthought
- No feedback on filter effectiveness (result count)

**Suggestions:**

1. **Redesign Filter Panel**
   - **Option A - Sidebar (Desktop):**
     - Fixed left sidebar with always-visible filter options
     - Collapsible sections for each filter type
     - Show all options with checkboxes/radio buttons
     - Display result count in real-time
   
   - **Option B - Filter Bar (Mobile-Friendly):**
     - Horizontal chip-style filter buttons
     - Active filters shown as colored chips with X to remove
     - "Add Filter" button to open filter modal
     - Floating filter button on mobile

2. **Enhance Search Experience**
   - Larger, more prominent search input
   - Search icon inside input (left side)
   - Placeholder: "Search by title, director, or keyword..."
   - Show search suggestions as user types
   - Highlight matching terms in results
   - Display "X results for 'parasite'" above cards

3. **Active Filter Indicators**
   - Show active filters as removable chips below search
   - "Clear all filters" button when any filters active
   - Display result count: "Showing 12 of 36 films"
   - Visual indication of filtered state (different background)

---

#### **[HIGH PRIORITY] Schedule View & Export**

**Observation:** The schedule view presents information in a simple list format. The "Export as Markdown" button lacks prominence and may go unnoticed.

**Impact:**
- Users cannot easily visualize their festival day
- Time conflicts are not visually highlighted
- Export feature is underutilized
- Missing opportunity to help users optimize their schedule

**Suggestions:**

1. **Redesign Schedule View**
   - **Timeline Visualization:**
     - Show each day as a timeline with time slots
     - Visual blocks for each screening (sized by duration)
     - Overlap indicators for conflicting times
     - Travel time warnings between venues
     - Empty time gaps highlighted
   
   - **Card Layout with Conflict Detection:**
     ```
     March 16 (Sunday)
     ┌────────────────────────────────┐
     │ 16:00 - 18:00 (120 min)        │
     │ Another World                  │
     │ 📍 PALACE ifc                  │
     │ [View Details] [Remove]        │
     └────────────────────────────────┘
     ⚠️ Tight timing: Only 30min to next screening
     ```

2. **Enhance Export Functionality**
   - Promote export button with icon and color
   - Add export options:
     - Markdown (current)
     - iCalendar (.ics) for calendar apps
     - PDF for printing
     - Share link for friends
   - Preview before export
   - Include poster thumbnails in PDF export

3. **Schedule Optimization Features**
   - "Optimize my schedule" button
   - Suggest alternative screenings to resolve conflicts
   - Show venue clustering (films at same location)
   - Calculate total travel time
   - "Meal break" suggestions for long days

---

#### **[MEDIUM PRIORITY] Modern Scheduler View**

**Observation:** The "Modern Scheduler" view presents all screenings in a chronological list format. This view duplicates some catalogue functionality but with a different layout.

**Impact:**
- Purpose of this view vs. catalogue is unclear
- Layout doesn't feel distinctly "modern"
- Filters are present but selection mechanism is missing
- Good concept but execution needs refinement

**Suggestions:**

1. **Clarify View Purpose**
   - Rename to clearly differentiate from catalogue
   - If this is meant to be a "timeline browsing" view, make it more visual
   - Consider: Calendar grid layout with films in time slots
   - Or: Gantt chart style with films as horizontal bars across days

2. **Improve Selection UX**
   - Add "Add to Schedule" button on each screening card
   - Show visual indicator if already selected
   - Enable quick-add without opening modal
   - Display running total of selected screenings

3. **Enhance Visual Design**
   - Group by date with large date headers
   - Show day of week prominently
   - Color-code by venue or category
   - Add timeline visualization on left margin
   - Make screening cards more interactive

---

#### **[MEDIUM PRIORITY] Accessibility & Inclusive Design**

**Observation:** Basic accessibility features are present (skip link, ARIA labels, semantic HTML), but implementation is incomplete. Color contrast appears adequate but border on minimal in some areas.

**Impact:**
- Screen reader users may experience navigation challenges
- Keyboard-only users lack visible focus indicators
- Color-blind users cannot distinguish category types
- Mobile users face touch target issues

**Suggestions:**

1. **Keyboard Navigation & Focus Management**
   - Add visible focus indicators with high contrast outline
   - Ensure focus trap within modal (can't tab outside)
   - Add keyboard shortcuts:
     - `/` to focus search
     - `Esc` to close modal
     - `1`, `2`, `3` to switch tabs
   - Show focus indicators on all interactive elements
   - **Test:** Navigate entire app using only keyboard

2. **Color Contrast & Visual Indicators**
   - Current text appears black on white (likely 21:1, exceeds WCAG AAA)
   - Gray buttons (rgb(239, 239, 239)) may have insufficient contrast
   - **Recommendation:** Test all text/background pairs with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Minimum targets:
     - Large text: 3:1 (WCAG AA)
     - Normal text: 4.5:1 (WCAG AA)
     - Interactive elements: 3:1 against adjacent colors
   - Don't rely on color alone: Use icons, patterns, text labels

3. **Touch Targets & Mobile Usability**
   - Minimum touch target: 44x44px (Apple) or 48x48px (Material)
   - Current buttons may be too small on mobile
   - Increase spacing between clickable elements
   - Make entire film card clickable (not just title)
   - Add swipe gestures for mobile navigation

4. **Screen Reader Optimization**
   - Add `aria-live` regions for dynamic updates (filter results)
   - Improve button labels: "Select screening on March 16 at 16:00" vs. "Select this screening"
   - Add `aria-describedby` for additional context
   - Test with NVDA (Windows), JAWS, and VoiceOver (macOS/iOS)
   - Add meaningful alt text for all poster images: "Film poster for [Title]"

5. **Reduced Motion Support**
   - Respect `prefers-reduced-motion` media query
   - Disable animations for users who request it
   - Provide instant transitions instead of animated ones

---

#### **[MEDIUM PRIORITY] Responsive Design & Mobile Experience**

**Observation:** The application is responsive but the mobile experience is a shrunk-down version of desktop rather than a mobile-optimized design.

**Impact:**
- Mobile users face cramped layouts and small touch targets
- Film cards lose visual appeal at smaller sizes
- Filters are harder to access on mobile
- Modal takes full screen but doesn't use space efficiently

**Suggestions:**

1. **Mobile-First Redesign**
   - **Film Cards:** Single column, larger images
   - **Filters:** Slide-up drawer or dedicated filter page
   - **Navigation:** Bottom tab bar (more thumb-friendly)
   - **Search:** Prominent at top, expandable on tap
   - **Modal:** Full-screen takeover with better use of space

2. **Responsive Breakpoints**
   ```css
   Mobile:  320px - 767px   (1 column, stacked UI)
   Tablet:  768px - 1023px  (2 columns, hybrid UI)
   Desktop: 1024px+         (3+ columns, sidebar filters)
   ```

3. **Mobile-Specific Features**
   - Pull-to-refresh on catalogue view
   - Swipe to dismiss modal
   - Floating "My Schedule" button (always accessible)
   - Bottom sheet for quick actions
   - Native share integration for schedule

---

#### **[MEDIUM PRIORITY] Loading States & Feedback**

**Observation:** The application loads quickly (LCP: 261ms) but lacks visual feedback during user interactions and potential loading states.

**Impact:**
- Users uncertain if actions registered
- No indication during filter/search operations
- Potential confusion if data loading is delayed
- Professional polish is reduced

**Suggestions:**

1. **Add Loading Skeletons**
   - Show skeleton screens while loading film data
   - Skeleton cards with placeholder boxes
   - Prevents layout shift and sets expectations
   - **Reference:** [Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)

2. **Interaction Feedback**
   - Button states: Default → Hover → Active → Success
   - "Select screening" → Loading spinner → "Added ✓"
   - Filter changes: Brief loading indicator on results
   - Search: Loading indicator while filtering results
   - Smooth transitions (200-300ms) between states

3. **Error States**
   - No results: Show helpful empty state
     - "No films match your filters"
     - Suggestions: "Try removing some filters" with button
     - Or: "Search for something else"
   - Network error: Friendly message with retry button
   - Failed export: Toast notification with error details

---

#### **[LOW PRIORITY] Content Presentation & Metadata**

**Observation:** Film metadata is presented in a basic text format. Metadata like language/subtitles is shown as concatenated strings in Chinese.

**Impact:**
- Information is less scannable
- Non-Chinese speakers cannot understand subtitle information
- Director and country info lack visual interest
- No ratings or user reviews (may be intentional)

**Suggestions:**

1. **Structured Metadata Display**
   - **Icons for metadata:**
     - 🎬 Director
     - 🌏 Country
     - ⏱️ Duration
     - 🗣️ Language
     - 📝 Subtitles
   - **Visual tags/badges** instead of inline text
   - **Ratings** (if applicable): Star rating or festival awards

2. **Bilingual Metadata Handling**
   - Language/subtitle info should switch with UI language
   - Or: Use universal icons (e.g., "CC" for subtitles)
   - Flag icons for language/country

3. **Enhanced Film Information**
   - Cast information (main actors)
   - Film festival selections/awards
   - Trailer embed or link
   - User reviews/ratings (if applicable)
   - Social sharing buttons

---

#### **[LOW PRIORITY] Branding & Visual Identity**

**Observation:** The application has minimal branding beyond the "HKAFF 2025" title. No logo, limited color palette, and generic typography.

**Impact:**
- Lacks visual identity and memorability
- Doesn't evoke excitement about the festival
- Missed opportunity to establish brand consistency
- Feels generic rather than curated

**Suggestions:**

1. **Brand Elements**
   - Add festival logo/wordmark
   - Custom typography for headings (film festival aesthetic)
   - Brand colors throughout interface
   - Festival dates and theme/tagline
   - Footer with festival information and sponsors

2. **Visual Enhancements**
   - Hero section with festival key visual
   - Background patterns or subtle film-related graphics
   - Custom illustrations for empty states
   - Film strip or reel motifs in UI elements
   - Parallax effects or subtle animations

3. **Emotional Design**
   - Inject personality into copy:
     - "Your festival, your schedule" instead of "My Schedule"
     - "Discover amazing films" instead of "Catalogue"
   - Use engaging empty states:
     - "Your schedule is empty. Time to start exploring!"
   - Celebration moments:
     - Confetti animation when completing schedule
     - Badge for "Festival veteran" (10+ films selected)

---

#### **[LOW PRIORITY] Advanced Features & Future Enhancements**

**Observation:** The core functionality is solid, but opportunities exist for features that could elevate the user experience.

**Impact:**
- Users may use competing apps for additional features
- Power users lack advanced planning tools
- Social/community aspects are absent
- No personalization based on preferences

**Suggestions:**

1. **Personalization**
   - Save favorite directors/actors
   - Recommended films based on selections
   - "People who liked this also selected..."
   - Genre preferences

2. **Social Features**
   - Share schedule with friends
   - See what friends are attending
   - Group scheduling (coordinate with others)
   - Social login (save across devices)

3. **Advanced Scheduling**
   - Multi-day view calendar
   - Conflict resolution algorithm
   - Venue map integration
   - Transit directions between venues
   - Notification reminders before screenings

4. **Gamification**
   - Film bingo card
   - Achievement badges
   - "Complete a category" challenges
   - Post-festival: Rate films you watched

---

## Performance Analysis

### Current Metrics (from DevTools Performance Trace)

- **LCP (Largest Contentful Paint):** 261ms ✅ Excellent
- **TTFB (Time to First Byte):** 97ms ✅ Excellent
- **Render Delay:** 164ms ✅ Good
- **CLS (Cumulative Layout Shift):** 0.00 ✅ Perfect
- **Overall Load Performance:** Very Good

### Identified Performance Issues

1. **Render Blocking Resources**
   - Impact: Delaying FCP/LCP by ~94ms
   - Recommendation: Defer non-critical CSS/JS
   - Inline critical CSS for above-the-fold content

2. **DOM Size**
   - Large DOM can increase style calculation time
   - Consider virtual scrolling for long film lists
   - Lazy load images below the fold

### Recommendations

- Already performing well; maintain current optimization
- Consider code splitting for different views
- Implement progressive image loading for posters
- Add service worker for offline capability

---

## Comparison with Industry Best Practices

### Film Festival Selectors Benchmarked

1. **SXSW Schedule** (sxsw.com)
   - ✅ Strong visual design with brand identity
   - ✅ Advanced filtering with tags
   - ✅ Calendar view and list view toggle
   - ✅ Social integration
   - ❌ Complex interface may overwhelm new users

2. **Sundance Film Festival** (festival.sundance.org)
   - ✅ Beautiful film cards with large imagery
   - ✅ Personalized recommendations
   - ✅ Robust search and discovery
   - ✅ Mobile app integration
   - ❌ Requires login for full functionality

3. **Toronto International Film Festival** (tiff.net)
   - ✅ Excellent typography and hierarchy
   - ✅ Clear scheduling and conflict detection
   - ✅ Venue information and maps
   - ✅ Trailer integration
   - ❌ Can be slow to load

### HKAFF 2025 Competitive Position

**Strengths vs. Competitors:**
- ✅ Faster load times than most competitors
- ✅ Simpler, less overwhelming interface
- ✅ Better bilingual implementation
- ✅ No login required (lower barrier to entry)

**Gaps vs. Competitors:**
- ❌ Less visually appealing
- ❌ Limited discovery features
- ❌ Basic scheduling tools (no conflict detection)
- ❌ Minimal branding and emotional engagement
- ❌ No social or community features

---

## Priority Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)
**Goal:** Address critical visual and usability issues

1. ✅ Implement typography scale and improve heading sizes
2. ✅ Redesign film cards with better spacing and hierarchy
3. ✅ Add color system for categories and actions
4. ✅ Improve button states and interaction feedback
5. ✅ Enhance focus indicators for accessibility
6. ✅ Add result count and active filter indicators

**Expected Impact:** Immediate improvement in perceived quality and usability

### Phase 2: Core Experience (2-4 weeks)
**Goal:** Elevate key user journeys

1. ✅ Redesign film detail modal
2. ✅ Improve filter panel and search experience
3. ✅ Enhance schedule view with conflict detection
4. ✅ Optimize mobile responsive design
5. ✅ Add loading states and error handling
6. ✅ Implement keyboard navigation

**Expected Impact:** Significantly better user satisfaction and task completion

### Phase 3: Refinement (4-6 weeks)
**Goal:** Polish and advanced features

1. ✅ Brand identity integration
2. ✅ Advanced filtering and discovery
3. ✅ Export format options (iCal, PDF)
4. ✅ Timeline visualization in Modern Scheduler
5. ✅ Accessibility audit and remediation
6. ✅ Performance optimization

**Expected Impact:** Best-in-class film festival selector experience

### Phase 4: Future Enhancements (6+ weeks)
**Goal:** Competitive differentiation

1. ⭐ Personalization and recommendations
2. ⭐ Social features and sharing
3. ⭐ Venue maps and directions
4. ⭐ Gamification elements
5. ⭐ Mobile app (iOS/Android)
6. ⭐ Offline support with service worker

**Expected Impact:** Market-leading features and user retention

---

## Mockup Suggestions & Visual References

### Film Card Redesign Concept

```
Before (Current):
┌─────────────────────────────────────┐
│ [Small Poster]  Parasite            │
│                 Fan Favorites       │
│                 A poor family...    │
│                 [Button to view]    │
└─────────────────────────────────────┘

After (Recommended):
┌─────────────────────────────────────┐
│         [Larger Poster]             │ ← 16:9 aspect, fills card
│                                     │
│ ─────────────────────────────────── │
│ Parasite                            │ ← 20-24px, bold
│ 🏆 Fan Favorites                    │ ← Colored badge
│                                     │
│ A poor family infiltrates the life │ ← 2 lines, ellipsis
│ of a wealthy household...           │
│                                     │
│ 📍 Broadway • ⏱️ 132 min           │ ← Icons for scan
│ 🎬 3 screenings available           │
│                                     │
│ [     View Screenings     ]         │ ← Primary CTA
└─────────────────────────────────────┘
```

### Modal Redesign Concept

```
Current: Single column, scrolling list

Recommended: Two-column with prominent poster
┌──────────────────────────────────────────────┐
│  [X Close]                   [Share] [Save]  │
├───────────┬──────────────────────────────────┤
│           │  Parasite                        │
│           │  Director: Bong Joon-ho          │
│  [Large   │  🇰🇷 South Korea • ⏱️ 132 min  │
│   Poster] │  🏆 Fan Favorites                │
│           │                                  │
│           │  Synopsis:                       │
│           │  A poor family schemes to...     │
│           │                                  │
│           │  ═══════════════════════════     │
│           │  AVAILABLE SCREENINGS (3)        │
│           │                                  │
│           │  March 15 (Saturday)             │
│           │  ┌────────────────────────────┐  │
│           │  │ 14:00 - 16:12              │  │
│           │  │ 📍 Broadway Cinematheque   │  │
│           │  │ 🗣️ Korean • 📝 EN/TC Subs │  │
│           │  │ [    Select Screening    ] │  │
│           │  └────────────────────────────┘  │
└───────────┴──────────────────────────────────┘
```

### Reference Resources

**Design Inspiration:**
- [Dribbble - Film Festival UI](https://dribbble.com/search/film-festival)
- [Behance - Cinema App Design](https://www.behance.net/search/projects?search=cinema%20app)
- [IMDb Mobile App](https://www.imdb.com/apps/) - Film card design patterns
- [Letterboxd](https://letterboxd.com/) - Film browsing and lists

**Component Libraries:**
- [Shadcn UI](https://ui.shadcn.com/) - Modern component patterns (you're already using)
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Tailwind UI](https://tailwindui.com/) - Professional examples

**Design Systems:**
- [Material Design 3](https://m3.material.io/) - Comprehensive guidelines
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Atlassian Design System](https://atlassian.design/) - Excellent patterns

---

## Accessibility Compliance Checklist

### WCAG 2.1 Level AA Compliance Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| **1.1.1 Non-text Content** | ⚠️ Partial | All images have alt text but could be more descriptive |
| **1.3.1 Info and Relationships** | ✅ Pass | Semantic HTML used appropriately |
| **1.3.2 Meaningful Sequence** | ✅ Pass | Logical reading order |
| **1.4.1 Use of Color** | ❌ Fail | Color is the only indicator for some states |
| **1.4.3 Contrast (Minimum)** | ⚠️ Partial | Most text passes, some buttons need verification |
| **1.4.5 Images of Text** | ✅ Pass | No images of text used |
| **1.4.10 Reflow** | ⚠️ Partial | Content reflows but not optimally on mobile |
| **1.4.11 Non-text Contrast** | ❌ Fail | Some interactive elements lack sufficient contrast |
| **2.1.1 Keyboard** | ⚠️ Partial | All functions keyboard accessible but lacks visible focus |
| **2.1.2 No Keyboard Trap** | ✅ Pass | No keyboard traps detected |
| **2.4.1 Bypass Blocks** | ✅ Pass | Skip link present |
| **2.4.3 Focus Order** | ✅ Pass | Logical focus order |
| **2.4.7 Focus Visible** | ❌ Fail | Focus indicators not sufficiently visible |
| **3.1.1 Language of Page** | ✅ Pass | `lang` attribute set |
| **3.2.3 Consistent Navigation** | ✅ Pass | Navigation is consistent |
| **4.1.2 Name, Role, Value** | ✅ Pass | ARIA labels implemented |

**Overall WCAG AA Compliance: ~65%** (Requires remediation)

### Critical Accessibility Fixes Needed

1. **Add visible focus indicators** (2.4.7)
2. **Don't rely on color alone** for state changes (1.4.1)
3. **Improve contrast** on interactive elements (1.4.11)
4. **Better alt text** for film posters (1.1.1)

---

## Conclusion

The HKAFF 2025 Screening Selector has a **strong functional foundation** but requires **significant design refinement** to match the quality and emotional engagement expected of a premium film festival experience. The application successfully addresses core user needs (browsing, selecting, scheduling) but does so in a visually austere, utilitarian manner.

### Critical Success Factors

**Must Address:**
1. Visual hierarchy and design system
2. Film card redesign for better browsing
3. Modal/detail experience enhancement
4. Accessibility compliance gaps

**Should Address:**
5. Filter and search experience
6. Schedule view improvements
7. Mobile optimization
8. Brand identity integration

**Nice to Have:**
9. Advanced features (recommendations, social)
10. Gamification elements

### Final Recommendation

**Invest in Phase 1 and Phase 2 immediately.** These changes will transform the application from "functional but forgettable" to "delightful and professional" without requiring architectural changes. The strong technical foundation (performance, accessibility structure, state management) means design improvements can be implemented rapidly.

With the recommended changes, HKAFF 2025 Screening Selector can become a **best-in-class film festival tool** that festival-goers actively want to use, rather than merely tolerate.

---

**Review Completed:** October 3, 2025  
**Next Steps:** Share with development team and prioritize Phase 1 implementation

