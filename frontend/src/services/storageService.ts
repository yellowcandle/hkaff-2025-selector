/**
 * StorageService - Manages user selections in LocalStorage
 *
 * Implements IStorageService interface from service-interfaces.ts
 * Persists user selections and preferences with versioned schema
 */

import type {
  Film,
  Screening,
  Venue,
  UserSelection,
  LocalStorageSchema,
  IStorageService
} from '../../../specs/001-given-this-film/contracts/service-interfaces';

const STORAGE_KEY = 'hkaff_2025_selections';
const CURRENT_VERSION = 1;

/**
 * StorageService implementation
 */
class StorageService implements IStorageService {
  /**
   * Load data from LocalStorage with migration support
   * @returns Parsed and migrated storage schema
   */
  private loadData(): LocalStorageSchema {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        // Return default schema
        return this.createDefaultSchema();
      }

      const data = JSON.parse(raw);

      // Migrate if needed
      return this.migrateData(data);
    } catch (error) {
      console.warn('Failed to load localStorage data, returning defaults:', error);
      return this.createDefaultSchema();
    }
  }

  /**
   * Create default schema
   */
  private createDefaultSchema(): LocalStorageSchema {
    return {
      version: CURRENT_VERSION,
      last_updated: new Date().toISOString(),
      selections: [],
      preferences: {
        language: 'tc'
      }
    };
  }

  /**
   * Migrate data from old versions to current version
   */
  /**
   * Type guard to check if data is a valid storage object
   */
  private isStorageData(data: unknown): data is Partial<LocalStorageSchema> {
    return typeof data === 'object' && data !== null;
  }

  /**
   * Safely get a property from unknown data
   */
  private getProperty<T>(data: unknown, property: string, defaultValue: T): T {
    if (this.isStorageData(data) && property in data) {
      const value = (data as Record<string, unknown>)[property];
      return (value as T) ?? defaultValue;
    }
    return defaultValue;
  }

  private migrateData(data: unknown): LocalStorageSchema {
    // If no version or old version, migrate to v1
    if (!this.getProperty(data, 'version', 0) || this.getProperty(data, 'version', 0) < CURRENT_VERSION) {
      const migrated: LocalStorageSchema = {
        version: CURRENT_VERSION,
        last_updated: new Date().toISOString(),
        selections: this.getProperty(data, 'selections', []),
        preferences: {
          language: this.getProperty(data, 'language_preference',
            this.getProperty(this.getProperty(data, 'preferences', {}), 'language', 'tc'))
        }
      };

      // Save migrated data
      this.saveData(migrated);
      return migrated;
    }

    return data as LocalStorageSchema;
  }

  /**
   * Save data to LocalStorage
   */
  private saveData(data: LocalStorageSchema): void {
    try {
      data.last_updated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error('Failed to save selections');
    }
  }

  /**
   * Get all user selections from LocalStorage
   * @returns Array of user selections (empty if none)
   */
  getSelections(): UserSelection[] {
    const data = this.loadData();
    return data.selections;
  }

  /**
   * Add a screening to user's selections
   * @param screening The screening to select
   * @param film The associated film data
   * @param venue The associated venue data
   * @returns The created UserSelection
   * @throws Error if screening already selected
   */
  addSelection(screening: Screening, film: Film, venue: Venue): UserSelection {
    const data = this.loadData();

    // Check if already selected
    if (data.selections.some(s => s.screening_id === screening.id)) {
      throw new Error(`Screening ${screening.id} is already selected`);
    }

    // Create UserSelection with denormalized snapshots
    const selection: UserSelection = {
      screening_id: screening.id,
      added_at: new Date().toISOString(),
      film_snapshot: {
        id: film.id,
        title_tc: film.title_tc,
        title_en: film.title_en,
        poster_url: film.poster_url
      },
      screening_snapshot: {
        id: screening.id,
        datetime: screening.datetime,
        duration_minutes: screening.duration_minutes,
        venue_name_tc: venue.name_tc,
        venue_name_en: venue.name_en
      }
    };

    data.selections.push(selection);
    this.saveData(data);

    return selection;
  }

  /**
   * Remove a screening from user's selections
   * @param screeningId The screening ID to remove
   * @returns true if removed, false if not found
   */
  removeSelection(screeningId: string): boolean {
    const data = this.loadData();
    const initialLength = data.selections.length;

    data.selections = data.selections.filter(s => s.screening_id !== screeningId);

    if (data.selections.length < initialLength) {
      this.saveData(data);
      return true;
    }

    return false;
  }

  /**
   * Check if a screening is currently selected
   * @param screeningId The screening ID to check
   */
  isSelected(screeningId: string): boolean {
    const data = this.loadData();
    return data.selections.some(s => s.screening_id === screeningId);
  }

  /**
   * Clear all user selections
   */
  clearAll(): void {
    const data = this.loadData();
    data.selections = [];
    this.saveData(data);
  }

  /**
   * Get current language preference
   */
  getLanguage(): 'tc' | 'en' {
    const data = this.loadData();
    return data.preferences.language;
  }

  /**
   * Set language preference
   * @param language The language code to set
   */
  setLanguage(language: 'tc' | 'en'): void {
    const data = this.loadData();
    data.preferences.language = language;
    this.saveData(data);
  }

  /**
   * Export raw storage data (for debugging/migration)
   */
  exportData(): LocalStorageSchema {
    return this.loadData();
  }

  /**
   * Import raw storage data (for migration/restore)
   * @param data The data to import
   */
  importData(data: LocalStorageSchema): void {
    this.saveData(data);
  }
}

// Export both class and singleton instance
export { StorageService };
export const storageService = new StorageService();
export default storageService;
