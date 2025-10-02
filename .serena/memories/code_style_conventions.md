# Code Style & Conventions - HKAFF 2025 Selector

## General Principles
- **TDD First**: Write failing tests before implementation
- **Mobile-First**: Design for smallest screens first, then enhance
- **Component Isolation**: Each component should be independently testable
- **Type Safety**: Use TypeScript interfaces for all data structures
- **Performance First**: Consider bundle size and render performance

## File Naming Conventions
```
Components/           # PascalCase for component files
├── FilmList/
│   ├── FilmList.jsx      # Main component container
│   └── FilmCard.jsx      # Individual item component
├── ScheduleView/
│   ├── ScheduleView.jsx
│   ├── DateGroup.jsx
│   └── ScreeningItem.jsx

Services/             # camelCase for service files
├── dataLoader.js
├── storageService.js
├── conflictDetector.js
└── markdownExporter.js

Utils/               # camelCase for utility files
├── dateHelpers.js
└── i18n.js

Tests/               # Descriptive names with .test.js/.spec.js
├── unit/
│   ├── storageService.test.js
│   └── conflictDetector.test.js
├── contract/
│   ├── data-schema.test.js
│   └── service-interfaces.test.js
└── e2e/
    ├── film-browsing.spec.js
    └── schedule-management.spec.js
```

## Code Structure Patterns

### Component Structure
```jsx
// FilmCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FilmCard - Displays film information in catalogue grid
 * @param {Object} props - Component props
 * @param {Film} props.film - Film data object
 * @param {Function} props.onSelect - Selection handler
 */
export function FilmCard({ film, onSelect }) {
  const { t } = useTranslation();
  
  return (
    <div className="film-card">
      {/* Component JSX */}
    </div>
  );
}

export default FilmCard;
```

### Service Structure
```javascript
// storageService.js
/**
 * StorageService - Manages user selections in LocalStorage
 * Implements IStorageService interface from contracts/
 */
export class StorageService {
  /**
   * Get all user selections from LocalStorage
   * @returns {UserSelection[]} Array of selections
   */
  getSelections() {
    // Implementation
  }
  
  /**
   * Add a screening to user's selections
   * @param {Screening} screening - Screening to select
   * @param {Film} film - Associated film data
   * @param {Venue} venue - Associated venue data
   * @returns {UserSelection} Created selection
   */
  addSelection(screening, film, venue) {
    // Implementation
  }
}

export default new StorageService();
```

## TypeScript Conventions
```typescript
// Use interfaces from contracts/
import type { Film, Screening, UserSelection } from '../contracts/service-interfaces';

// Type annotations for function parameters
export function detectConflicts(selections: UserSelection[]): Conflict[] {
  // Implementation
}

// Prefer interface over type for objects
interface LocalStorageSchema {
  version: number;
  last_updated: string;
  selections: UserSelection[];
  preferences: {
    language: 'tc' | 'en';
  };
}
```

## CSS/Tailwind Conventions
```jsx
// Mobile-first responsive classes
<div className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  p-4              // Consistent padding
  rounded-lg       // Consistent rounding
  hover:shadow-lg  // Interactive states
">

// Semantic class naming
<div className="film-card">
<div className="schedule-view">
<div className="filter-panel">

// Touch targets (minimum 44x44px)
<button className="min-h-[44px] min-w-[44px]">
```

## i18n Conventions
```javascript
// Translation keys (nested structure)
{
  "common": {
    "buttons": {
      "select": "Select",
      "remove": "Remove",
      "export": "Export"
    },
    "labels": {
      "schedule": "My Schedule",
      "films": "Films",
      "filter": "Filter"
    }
  },
  "films": {
    "runtime": "{{minutes}} minutes",
    "director": "Director: {{name}}"
  }
}

// Usage in components
const { t } = useTranslation();
t('common.buttons.select')
t('films.runtime', { minutes: film.runtime_minutes })
```

## Testing Conventions
```javascript
// Unit tests - Describe behavior
describe('StorageService', () => {
  describe('addSelection', () => {
    it('should add selection to LocalStorage', () => {
      // Test implementation
    });
    
    it('should throw error if screening already selected', () => {
      // Test implementation
    });
  });
});

// E2E tests - Describe user scenarios
describe('Film Browsing', () => {
  it('should display film catalogue in grid layout', async () => {
    await page.goto('/');
    await expect(page.locator('.film-card')).toHaveCount(80);
  });
});
```

## Git Commit Conventions
```
feat: add FilmCard component with poster display
fix: resolve conflict detection edge case
test: add contract tests for data schemas
refactor: extract date helpers to utility module
chore: update dependencies and add linting rules
```

## Performance Conventions
```javascript
// React performance - use memo for expensive components
export const FilmCard = React.memo(({ film, onSelect }) => {
  // Component implementation
});

// Service performance - cache expensive operations
const cachedFilms = new Map();
export function loadFilms() {
  if (cachedFilms.has('films')) {
    return cachedFilms.get('films');
  }
  // Load and cache data
}

// Bundle optimization - dynamic imports for large components
const FilmDetail = lazy(() => import('./FilmDetail'));
```

## Error Handling Conventions
```javascript
// Services - throw descriptive errors
export function loadFilms() {
  try {
    const data = await fetch('/data/films.json');
    if (!data.ok) {
      throw new Error(`Failed to load films: ${data.status}`);
    }
    return await data.json();
  } catch (error) {
    console.error('DataLoader: loadFilms failed', error);
    throw error;
  }
}

// Components - error boundaries for graceful failures
export function FilmList() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  // Normal component render
}
```