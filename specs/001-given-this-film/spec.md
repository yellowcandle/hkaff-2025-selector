# Feature Specification: Hong Kong Asian Film Festival Screening Selector

**Feature Branch**: `001-given-this-film`  
**Created**: 2025-10-02  
**Status**: Draft  
**Input**: User description: "given this film festival catalogue, write a web app for users to select their screenings and check the schedule of the screenings https://www.hkaff.asia/tc/film/2025"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session 2025-10-02
- Q: How should user screening selections be preserved across sessions? → A: Browser local storage only (no login required, device-specific)
- Q: When a user selects overlapping screenings, how should the system respond? → A: Warn only (allow conflicting selections, show warning message)
- Q: How should the app obtain film and screening data from the HKAFF catalogue? → A: Static import (one-time data snapshot, no updates)
- Q: How should the app support Traditional Chinese and English? → A: In-app language toggle (user switches language within app)
- Q: How should the user's schedule organize selected screenings chronologically? → A: By date with time shown (grouped by day, ordered by time within each day)
- Q: Should users be able to export their schedule? → A: Yes, markdown export for copy/paste from web
- Q: Should the app display ticket availability or sold-out status for screenings? → A: No ticket integration (show all screenings regardless of availability)
- Q: How should the app work on mobile and desktop devices? → A: Responsive web design (single app adapts to screen size)
- Q: What is the acceptable response time for user interactions (clicking to view film details, selecting screenings, switching language)? → A: < 1 second

---

## User Scenarios & Testing

### Primary User Story
A film festival attendee wants to browse the Hong Kong Asian Film Festival 2025 catalogue, select screenings they want to attend based on films, times, and venues, and create a personalized schedule to manage their festival experience.

### Acceptance Scenarios
1. **Given** a user visits the app on any device, **When** they view the film catalogue, **Then** they see all available films with details (title, category, venue options) in their selected language (TC or EN) with layout adapted to their screen size
1a. **Given** a user is viewing the app, **When** they use the language toggle, **Then** all interface text and film information switches to the selected language
2. **Given** a user browses films, **When** they select a film they want to see, **Then** they can choose from available screening times and venues
3. **Given** a user has selected multiple screenings, **When** they view their schedule, **Then** they see all selected screenings grouped by date, ordered by time within each day, with venue information
4. **Given** a user has selected screenings, **When** there is a time conflict between two selections, **Then** they see a warning message but both selections remain in their schedule
5. **Given** a user has created a schedule, **When** they return to the app later on the same device/browser, **Then** their selections are preserved from browser local storage
6. **Given** a user views their schedule, **When** they need to remove a screening, **Then** they can deselect it and it's removed from their schedule
7. **Given** a user has created a schedule, **When** they request to export it, **Then** they receive a markdown-formatted version they can copy and paste

### Edge Cases
- What happens when a user selects screenings at different venues with tight timing that may be impossible to attend? System warns about time overlap but allows the selection.
- How does the system handle sold-out screenings? App does not integrate ticket availability; all screenings are shown regardless of sold-out status.
- What happens if screening times or venues change after a user has made selections? Data is static; changes in official schedule are not reflected in app.
- Can users export their schedule? Yes, users can export to markdown format for copy/paste.

## Requirements

### Functional Requirements
- **FR-001**: System MUST display all films from the Hong Kong Asian Film Festival 2025 catalogue
- **FR-002**: System MUST show film details including title, category, and available screening venues
- **FR-003**: System MUST allow users to filter films by category (e.g., "開幕電影", "神秘場", "亞洲新導演獎", "紀錄之眼", etc.)
- **FR-004**: System MUST allow users to filter films by venue (e.g., "百老匯電影中心", "MOViE MOViE Pacific Place", etc.)
- **FR-005**: Users MUST be able to select specific screenings (film + time + venue combinations) they want to attend
- **FR-006**: Users MUST be able to view all their selected screenings in a schedule format
- **FR-007**: System MUST display screening schedules with date, time, and venue information
- **FR-008**: Users MUST be able to deselect/remove screenings from their schedule
- **FR-009**: System MUST persist user selections in browser local storage without requiring user accounts (device-specific, no cross-device sync)
- **FR-010**: System MUST detect and warn users about scheduling conflicts when screenings overlap, but allow conflicting selections to remain in schedule
- **FR-011**: System MUST contain film and screening data from the HKAFF 2025 catalogue as a static snapshot (no live updates or synchronization)
- **FR-012**: System MUST organize schedule by grouping screenings by date, then ordering by time within each day
- **FR-013**: Users MUST be able to export their schedule as markdown text for copy/paste
- **FR-014**: System MUST display all screenings without ticket availability or sold-out status integration

### Non-Functional Requirements
- **NFR-001**: System MUST provide an in-app language toggle allowing users to switch between Traditional Chinese and English
- **NFR-002**: System MUST use responsive web design to adapt layout and functionality for both mobile and desktop devices
- **NFR-003**: System MUST respond to user interactions (viewing film details, selecting/deselecting screenings, switching language, filtering) within 1 second

### Key Entities

- **Film**: Represents a movie in the festival catalogue with attributes including title (TC/EN), category/section, synopsis, runtime, director, country
- **Screening**: A specific showing of a film with date, time, venue, and relationship to its Film
- **Venue**: A cinema location where screenings occur (e.g., Broadway Cinematheque, MOViE MOViE Pacific Place)
- **Category**: Festival section/programme (e.g., Opening Film, New Director Award, Documentary Eye)
- **User Selection**: Device-specific record of chosen screenings stored in browser local storage, forming their personalized schedule
- **Schedule**: A collection of selected screenings grouped by date and ordered by time within each day, persisted locally per device

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Outstanding Clarifications Required


