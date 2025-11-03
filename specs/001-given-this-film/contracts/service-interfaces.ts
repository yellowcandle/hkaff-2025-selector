/**
 * Service Interfaces for HKAFF Screening Selector
 * 
 * These TypeScript interfaces define the contracts for all services.
 * Contract tests verify implementations conform to these signatures.
 */

// ============================================================================
// Data Models
// ============================================================================

export interface Film {
  id: string;
  title_tc: string;
  title_en: string;
  category_id: string;
  synopsis_tc?: string;
  synopsis_en?: string;
  runtime_minutes: number;
  director?: string;
  country?: string;
  poster_url?: string;
  detail_url_tc?: string;
  detail_url_en?: string;
}

export interface Screening {
  id: string;
  film_id: string;
  venue_id: string;
  datetime: string; // ISO 8601
  duration_minutes: number;
  language?: string;
}

export interface Venue {
  id: string;
  name_tc: string;
  name_en: string;
  address_tc?: string;
  address_en?: string;
  map_url?: string;
}

export interface Category {
  id: string;
  name_tc: string;
  name_en: string;
  sort_order: number;
  description_tc?: string;
  description_en?: string;
}

export interface UserSelection {
  screening_id: string;
  added_at: string; // ISO 8601
  film_snapshot: {
    id: string;
    title_tc: string;
    title_en: string;
    poster_url?: string;
  };
  screening_snapshot: {
    id: string;
    datetime: string;
    duration_minutes: number;
    venue_name_tc: string;
    venue_name_en: string;
  };
}

export interface Conflict {
  screening_a: UserSelection;
  screening_b: UserSelection;
  overlap_minutes: number;
  severity: 'warning' | 'impossible';
}

export interface LocalStorageSchema {
  version: number;
  last_updated: string; // ISO 8601
  selections: UserSelection[];
  preferences: {
    language: 'tc' | 'en';
  };
}

export interface UserPreferences {
  language: 'tc' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
}

// ============================================================================
// Service Interfaces
// ============================================================================

/**
 * IDataLoader - Loads static festival data from JSON files
 */
export interface IDataLoader {
  /**
   * Load all films from films.json
   * @throws Error if file not found or invalid JSON
   */
  loadFilms(): Promise<Film[]>;
  
  /**
   * Load all screenings from screenings.json
   * @throws Error if file not found or invalid JSON
   */
  loadScreenings(): Promise<Screening[]>;
  
  /**
   * Load all venues from venues.json
   * @throws Error if file not found or invalid JSON
   */
  loadVenues(): Promise<Venue[]>;
  
  /**
   * Load all categories from categories.json
   * @throws Error if file not found or invalid JSON
   */
  loadCategories(): Promise<Category[]>;
  
  /**
   * Load all data files in parallel
   * @returns Object with all loaded data
   */
  loadAll(): Promise<{
    films: Film[];
    screenings: Screening[];
    venues: Venue[];
    categories: Category[];
  }>;
}

/**
 * IStorageService - Manages user selections in LocalStorage
 */
export interface IStorageService {
  /**
   * Get all user selections from LocalStorage
   * @returns Array of user selections (empty if none)
   */
  getSelections(): UserSelection[];
  
  /**
   * Add a screening to user's selections
   * @param screening The screening to select
   * @param film The associated film data
   * @param venue The associated venue data
   * @returns The created UserSelection
   * @throws Error if screening already selected
   */
  addSelection(screening: Screening, film: Film, venue: Venue): UserSelection;
  
  /**
   * Remove a screening from user's selections
   * @param screeningId The screening ID to remove
   * @returns true if removed, false if not found
   */
  removeSelection(screeningId: string): boolean;
  
  /**
   * Check if a screening is currently selected
   * @param screeningId The screening ID to check
   */
  isSelected(screeningId: string): boolean;
  
  /**
   * Clear all user selections
   */
  clearAll(): void;
  
  /**
   * Get current language preference
   */
  getLanguage(): 'tc' | 'en';
  
  /**
   * Set language preference
   * @param language The language code to set
   */
  setLanguage(language: 'tc' | 'en'): void;
  
  /**
   * Export raw storage data (for debugging/migration)
   */
  exportData(): LocalStorageSchema;
  
  /**
   * Import raw storage data (for migration/restore)
   * @param data The data to import
   */
  importData(data: LocalStorageSchema): void;
}

/**
 * IConflictDetector - Detects scheduling conflicts between screenings
 */
export interface IConflictDetector {
  /**
   * Detect all conflicts in a set of user selections
   * @param selections Array of user selections to analyze
   * @returns Array of detected conflicts (empty if none)
   */
  detectConflicts(selections: UserSelection[]): Conflict[];
  
  /**
   * Check if adding a new screening would create conflicts
   * @param existingSelections Current user selections
   * @param newScreening Screening being considered
   * @param venueNameEn Optional English venue name for accurate conflict detection
   * @param venueNameTc Optional Traditional Chinese venue name for accurate conflict detection
   * @returns Array of conflicts with the new screening
   */
  wouldConflict(existingSelections: UserSelection[], newScreening: Screening, venueNameEn?: string, venueNameTc?: string): Conflict[];
  
  /**
   * Calculate overlap between two screenings in minutes
   * @param a First screening
   * @param b Second screening
   * @returns Overlap in minutes (0 if no overlap)
   */
  calculateOverlap(a: Screening, b: Screening): number;
  
  /**
   * Check if two screenings overlap in time
   * @param a First screening
   * @param b Second screening
   */
  hasOverlap(a: Screening, b: Screening): boolean;
}

/**
 * IMarkdownExporter - Exports user schedule to markdown format
 */
export interface IMarkdownExporter {
  /**
   * Export user selections as markdown text
   * @param selections Array of user selections
   * @param language Language for output ('tc' or 'en')
   * @returns Markdown-formatted schedule string
   */
  exportSchedule(selections: UserSelection[], language: 'tc' | 'en'): string;
  
  /**
   * Group selections by date for export
   * @param selections Array of user selections
   * @returns Map of date string to selections
   */
  groupByDate(selections: UserSelection[]): Map<string, UserSelection[]>;
  
  /**
   * Format a single selection as markdown
   * @param selection The selection to format
   * @param language Language for output
   */
  formatSelection(selection: UserSelection, language: 'tc' | 'en'): string;
}

/**
 * IScheduleService - Manages user's personalized schedule
 */
export interface IScheduleService {
  /**
   * Get user's schedule grouped by date and sorted by time
   * @returns Map of date string to sorted selections
   */
  getGroupedSchedule(): Map<string, UserSelection[]>;
  
  /**
   * Get all conflicts in current schedule
   */
  getConflicts(): Conflict[];
  
  /**
   * Get schedule statistics
   */
  getStats(): {
    total_selections: number;
    total_conflicts: number;
    dates: string[];
    venues: Set<string>;
  };
}
