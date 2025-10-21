/**
 * PreferencesService - Manages user preferences with LocalStorage integration
 *
 * Provides UserPreferencesManager functionality using existing storageService
 * Handles user preferences persistence and retrieval
 */

import type { UserPreferences } from '../../../specs/001-given-this-film/contracts/service-interfaces';
import { storageService } from './storageService';

export interface UserPreferencesManager {
  /**
   * Get current user preferences
   */
  getPreferences(): UserPreferences;

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserPreferences>): void;

  /**
   * Get specific preference value
   */
  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K];

  /**
   * Set specific preference value
   */
  setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void;

  /**
   * Reset preferences to defaults
   */
  resetToDefaults(): void;
}

/**
 * PreferencesService implementation
 */
class PreferencesService implements UserPreferencesManager {
  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    language: 'tc',
    theme: 'light',
    notifications: true,
    autoSave: true
  };

  /**
   * Get current user preferences
   */
  getPreferences(): UserPreferences {
    // Get language from storage service
    const language = storageService.getLanguage();

    // For now, return defaults with stored language
    // In future, could extend storageService to handle more preferences
    return {
      ...this.DEFAULT_PREFERENCES,
      language
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserPreferences>): void {
    // Handle language preference through storage service
    if (preferences.language !== undefined) {
      storageService.setLanguage(preferences.language);
    }

    // For other preferences, could extend storageService in future
    // For now, only language is persisted
  }

  /**
   * Get specific preference value
   */
  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const preferences = this.getPreferences();
    return preferences[key];
  }

  /**
   * Set specific preference value
   */
  setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
    this.updatePreferences({ [key]: value } as Partial<UserPreferences>);
  }

  /**
   * Reset preferences to defaults
   */
  resetToDefaults(): void {
    this.updatePreferences(this.DEFAULT_PREFERENCES);
  }
}

// Export singleton instance
export const preferencesService = new PreferencesService();
export { PreferencesService };
export default preferencesService;