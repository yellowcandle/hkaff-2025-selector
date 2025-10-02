# HKAFF 2025 Selector - Project Overview

## Project Purpose
A responsive web application for Hong Kong Asian Film Festival 2025 attendees to browse the film catalogue, select screenings they want to attend, manage scheduling conflicts, and export their personalized schedule. The app provides bilingual support (Traditional Chinese/English), stores selections in browser local storage (no user accounts), and deploys as a static single-page application.

## Tech Stack
- **Frontend**: React 18+ with Vite
- **Language**: TypeScript 5.x / JavaScript ES2022+
- **Styling**: Tailwind CSS (mobile-first responsive design)
- **Internationalization**: react-i18next with JSON locale files
- **Date/Time**: date-fns v3 for scheduling logic
- **Storage**: Browser LocalStorage API (client-side only)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Data Extraction**: Playwright web scraping from HKAFF website

## Project Structure
```
frontend/                 # React application
├── src/
│   ├── components/       # UI components (FilmList, ScheduleView, FilterPanel)
│   ├── services/         # Business logic (storage, scheduling, conflict detection)
│   ├── utils/           # Helper functions (date/time, formatters)
│   └── App.jsx          # Main application entry
├── public/
│   ├── data/            # Static film/screening catalogue (JSON)
│   └── locales/         # i18n translation files (tc/en)
tests/                   # Test suites
├── unit/                # Service and utility tests
├── contract/            # Schema and interface tests
└── e2e/                 # Playwright end-to-end tests
scripts/                 # Data extraction and build scripts
```

## Key Features
1. **Film Catalogue Browsing**: Display all HKAFF 2025 films with filtering by category/venue
2. **Screening Selection**: Users select specific screenings (film + time + venue)
3. **Schedule Management**: View selected screenings grouped by date with conflict detection
4. **Bilingual Support**: Instant language switching between Traditional Chinese and English
5. **Data Persistence**: LocalStorage-based persistence (no backend required)
6. **Export Functionality**: Markdown export for copy/paste schedule sharing
7. **Responsive Design**: Mobile-first design adapting to all screen sizes

## Data Model
- **Film**: Movie details (title, category, synopsis, runtime, director)
- **Screening**: Specific showing (film, venue, datetime, duration)
- **Venue**: Cinema location (name, address)
- **Category**: Festival section (Opening Film, Documentary Eye, etc.)
- **UserSelection**: User's chosen screenings with denormalized data
- **Conflict**: Overlap detection between selected screenings

## Performance Targets
- Initial load: <3 seconds on 3G connection
- Interaction response: <1 second for all user actions
- Bundle size: <180KB gzipped
- Lighthouse score: ≥90

## Development Status
Project is in setup phase - no source code exists yet. Ready for implementation following the TDD approach with 74 structured tasks covering setup, data extraction, testing, services, components, integration, and polish phases.