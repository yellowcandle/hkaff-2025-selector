// Application State Contract
// Defines the global application state structure and context interfaces
// Ensures consistent state management across the redesigned UI

import { UserSchedule, UserPreferences, Film, Screening, Venue, Category } from './data-types.contract';

export interface AppState {
  // Static data (loaded from JSON)
  films: Film[];
  screenings: Screening[];
  venues: Venue[];
  categories: Category[];

  // User state (from LocalStorage)
  userSchedule: UserSchedule;
  userPreferences: UserPreferences;

  // UI state
  ui: {
    isLoading: boolean;
    currentView: 'films' | 'schedule' | 'details';
    selectedFilmId?: string;
    searchQuery: string;
    selectedCategoryId?: string;
    showConflicts: boolean;
  };

  // Error state
  errors: Array<{
    id: string;
    type: 'data_load' | 'validation' | 'conflict';
    message: string;
    details?: any;
  }>;
}

export interface AppContextValue {
  state: AppState;
  actions: {
    // Data loading
    loadInitialData: () => Promise<void>;

    // User schedule actions
    addToSchedule: (screeningId: string) => void;
    removeFromSchedule: (screeningId: string) => void;
    clearSchedule: () => void;

    // User preferences
    updatePreferences: (preferences: Partial<UserPreferences>) => void;

    // UI actions
    setCurrentView: (view: AppState['ui']['currentView']) => void;
    setSelectedFilm: (filmId: string | undefined) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (categoryId: string | undefined) => void;
    toggleConflicts: () => void;

    // Error handling
    addError: (error: AppState['errors'][0]) => void;
    clearError: (errorId: string) => void;
  };
}

// Contract: State is read-only; mutations only through actions
// Contract: Actions are pure functions that update state immutably
// Contract: Error handling provides user feedback for all failure modes
// Contract: UI state is separate from business data for clean separation