# Quickstart: Frontend UI Rewrite Validation

## Overview
This quickstart validates that the new UI design matches the Figma mockup while preserving all existing functionality. Run these steps after implementation to ensure the feature works as specified.

## Prerequisites
- Application built and running locally
- Figma mockup accessible for visual comparison
- Existing functionality baseline established

## Test Scenarios

### Scenario 1: Homepage Visual Match
**Given** a user visits the film festival website
**When** they view the homepage
**Then** the interface matches the Figma mockup's visual design (colors, typography, spacing, layout) and basic interactions (hover, click states)

**Validation Steps**:
1. Open homepage in browser
2. Compare visual elements against Figma mockup
3. Test hover states on interactive elements
4. Verify responsive behavior on mobile/tablet/desktop
5. Check that all text has proper TC/EN translations

### Scenario 2: Film Browsing Functionality
**Given** a user browses film listings
**When** they interact with film cards and filters
**Then** all existing functionality works within the new UI design

**Validation Steps**:
1. Navigate to film listings page
2. Verify film cards display correctly with posters and info
3. Test category filters
4. Test search functionality
5. Ensure film details modal opens correctly
6. Verify responsive layout on different screen sizes

### Scenario 3: Schedule Management
**Given** a user selects films for their schedule
**When** they view their selections
**Then** the schedule interface reflects the new design while preserving all scheduling capabilities

**Validation Steps**:
1. Select multiple film screenings
2. View personal schedule
3. Verify conflict detection still works
4. Test schedule export functionality
5. Check that selections persist in LocalStorage
6. Ensure schedule displays correctly on mobile

## Accessibility Validation
- Run Lighthouse accessibility audit (score ≥95)
- Test keyboard navigation through all interactive elements
- Verify screen reader compatibility
- Check color contrast ratios
- Validate touch target sizes (minimum 44px)

## Performance Validation
- Page load time <3 seconds on 3G connection
- No console errors or warnings
- Smooth interactions (no jank on scroll/filter)

## Regression Tests
- All existing E2E tests pass
- No breaking changes to data models
- LocalStorage compatibility maintained
- i18n translations complete

## Success Criteria
- [ ] Visual design matches Figma mockup exactly
- [ ] All existing functionality preserved
- [ ] Responsive design works on all devices
- [ ] WCAG 2.1 AA compliance achieved
- [ ] Performance meets baseline requirements
- [ ] No regressions in existing features