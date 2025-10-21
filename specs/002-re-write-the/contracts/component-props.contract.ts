// Component Props Contracts
// Defines the interface contracts for React components
// All components must adhere to these prop interfaces for type safety

import { Film, Screening, Venue, Category, UserSchedule } from './data-types.contract';

export interface FilmCardProps {
  film: Film;
  isSelected?: boolean;
  onSelect?: (filmId: string) => void;
  onViewDetails?: (filmId: string) => void;
  className?: string;
}

export interface FilmListProps {
  films: Film[];
  selectedFilms?: string[];
  categories: Category[];
  onFilmSelect?: (filmId: string) => void;
  onCategoryFilter?: (categoryId: string | null) => void;
  searchQuery?: string;
  className?: string;
}

export interface ScheduleViewProps {
  schedule: UserSchedule;
  screenings: Screening[];
  films: Film[];
  venues: Venue[];
  onRemoveScreening?: (screeningId: string) => void;
  onAddScreening?: (screeningId: string) => void;
  className?: string;
}

export interface ConflictAlertProps {
  conflicts: Array<{
    screeningId: string;
    reason: 'time_overlap' | 'venue_conflict' | 'distance_issue';
    details: {
      venue?: string;
      timeOverlap?: number; // minutes
      distance?: number; // km
    };
  }>;
  onResolve?: (screeningId: string) => void;
  className?: string;
}

export interface LanguageSwitcherProps {
  currentLanguage: 'tc' | 'en';
  onLanguageChange: (language: 'tc' | 'en') => void;
  className?: string;
}

export interface SearchFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory?: string;
  categories: Category[];
  onCategoryChange: (categoryId: string | null) => void;
  className?: string;
}

// Contract: All event handlers are optional to support read-only modes
// Contract: className prop allows for styling customization
// Contract: Component props use data types from data-types.contract.ts
// Contract: Callback functions receive specific parameter types for type safety