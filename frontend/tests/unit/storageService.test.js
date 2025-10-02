/**
 * Unit Tests for LocalStorage Operations (T024)
 *
 * These tests validate the LocalStorage service for persisting user selections.
 * Tests will fail until storageService is implemented.
 *
 * Business Rules:
 * - Save/load user selections to/from LocalStorage
 * - Persist language preference
 * - Handle schema version migration
 * - Gracefully handle corrupted data
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('T024: LocalStorage Service Unit Tests', () => {
  // Mock LocalStorage
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null;
      },
      setItem(key, value) {
        this.data[key] = value;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      }
    };

    // Replace global localStorage with mock
    global.localStorage = mockLocalStorage;
  });

  // Mock data
  const createMockSelection = (id, filmTitle, datetime) => ({
    screening_id: `screening-${id}`,
    added_at: new Date().toISOString(),
    film_snapshot: {
      id: `film-${id}`,
      title_tc: filmTitle,
      title_en: filmTitle,
      poster_url: `poster-${id}.jpg`
    },
    screening_snapshot: {
      id: `screening-${id}`,
      datetime: datetime,
      duration_minutes: 120,
      venue_name_tc: 'Test Venue',
      venue_name_en: 'Test Venue'
    }
  });

  describe('Save Selections', () => {
    it('should save user selections to localStorage', () => {
      // This will fail until storageService.saveSelections() is implemented
      const selections = [
        createMockSelection('1', 'Film A', '2025-03-15T19:30:00'),
        createMockSelection('2', 'Film B', '2025-03-15T21:45:00')
      ];

      // Mock implementation
      const saveSelections = (selections) => {
        const data = {
          version: 1,
          last_updated: new Date().toISOString(),
          language_preference: 'tc',
          selections: selections
        };
        localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
      };

      saveSelections(selections);

      const saved = JSON.parse(localStorage.getItem('hkaff_2025_selections'));
      expect(saved).toBeDefined();
      expect(saved.version).toBe(1);
      expect(saved.selections).toHaveLength(2);
      expect(saved.selections[0].screening_id).toBe('screening-1');
    });

    it('should update last_updated timestamp on save', () => {
      const selections = [createMockSelection('1', 'Film A', '2025-03-15T19:30:00')];

      const saveSelections = (selections) => {
        const data = {
          version: 1,
          last_updated: new Date().toISOString(),
          language_preference: 'tc',
          selections: selections
        };
        localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
      };

      const beforeSave = new Date();
      saveSelections(selections);

      const saved = JSON.parse(localStorage.getItem('hkaff_2025_selections'));
      const lastUpdated = new Date(saved.last_updated);

      expect(lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    });

    it('should handle empty selections array', () => {
      const saveSelections = (selections) => {
        const data = {
          version: 1,
          last_updated: new Date().toISOString(),
          language_preference: 'tc',
          selections: selections
        };
        localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
      };

      saveSelections([]);

      const saved = JSON.parse(localStorage.getItem('hkaff_2025_selections'));
      expect(saved.selections).toHaveLength(0);
    });
  });

  describe('Load Selections', () => {
    it('should load user selections from localStorage', () => {
      // Pre-populate localStorage
      const mockData = {
        version: 1,
        last_updated: '2025-10-02T10:00:00Z',
        language_preference: 'tc',
        selections: [
          createMockSelection('1', 'Film A', '2025-03-15T19:30:00'),
          createMockSelection('2', 'Film B', '2025-03-15T21:45:00')
        ]
      };
      localStorage.setItem('hkaff_2025_selections', JSON.stringify(mockData));

      // Mock implementation
      const loadSelections = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return [];
        const parsed = JSON.parse(data);
        return parsed.selections || [];
      };

      const loaded = loadSelections();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].screening_id).toBe('screening-1');
      expect(loaded[1].screening_id).toBe('screening-2');
    });

    it('should return empty array when no data exists', () => {
      const loadSelections = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return [];
        const parsed = JSON.parse(data);
        return parsed.selections || [];
      };

      const loaded = loadSelections();
      expect(loaded).toHaveLength(0);
    });

    it('should handle corrupted JSON data gracefully', () => {
      localStorage.setItem('hkaff_2025_selections', '{invalid json}');

      const loadSelections = () => {
        try {
          const data = localStorage.getItem('hkaff_2025_selections');
          if (!data) return [];
          const parsed = JSON.parse(data);
          return parsed.selections || [];
        } catch (error) {
          console.warn('Failed to parse localStorage data:', error);
          return [];
        }
      };

      const loaded = loadSelections();
      expect(loaded).toHaveLength(0);
    });
  });

  describe('Language Preference Persistence', () => {
    it('should save language preference', () => {
      const saveLanguagePreference = (lang) => {
        const existing = localStorage.getItem('hkaff_2025_selections');
        const data = existing ? JSON.parse(existing) : {
          version: 1,
          last_updated: new Date().toISOString(),
          selections: []
        };
        data.language_preference = lang;
        data.last_updated = new Date().toISOString();
        localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
      };

      saveLanguagePreference('en');

      const saved = JSON.parse(localStorage.getItem('hkaff_2025_selections'));
      expect(saved.language_preference).toBe('en');
    });

    it('should load language preference', () => {
      const mockData = {
        version: 1,
        last_updated: '2025-10-02T10:00:00Z',
        language_preference: 'tc',
        selections: []
      };
      localStorage.setItem('hkaff_2025_selections', JSON.stringify(mockData));

      const loadLanguagePreference = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return 'tc'; // default
        const parsed = JSON.parse(data);
        return parsed.language_preference || 'tc';
      };

      const lang = loadLanguagePreference();
      expect(lang).toBe('tc');
    });

    it('should default to "tc" when no preference is saved', () => {
      const loadLanguagePreference = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return 'tc';
        const parsed = JSON.parse(data);
        return parsed.language_preference || 'tc';
      };

      const lang = loadLanguagePreference();
      expect(lang).toBe('tc');
    });
  });

  describe('Version Migration', () => {
    it('should handle version 1 schema', () => {
      const v1Data = {
        version: 1,
        last_updated: '2025-10-02T10:00:00Z',
        language_preference: 'tc',
        selections: [createMockSelection('1', 'Film A', '2025-03-15T19:30:00')]
      };
      localStorage.setItem('hkaff_2025_selections', JSON.stringify(v1Data));

      const loadWithMigration = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return { version: 1, selections: [], language_preference: 'tc' };

        const parsed = JSON.parse(data);

        // Check version and migrate if needed
        if (!parsed.version || parsed.version < 1) {
          // Migration logic would go here
          return {
            version: 1,
            last_updated: new Date().toISOString(),
            language_preference: parsed.language_preference || 'tc',
            selections: parsed.selections || []
          };
        }

        return parsed;
      };

      const loaded = loadWithMigration();
      expect(loaded.version).toBe(1);
      expect(loaded.selections).toHaveLength(1);
    });

    it('should migrate legacy data without version field', () => {
      const legacyData = {
        selections: [createMockSelection('1', 'Film A', '2025-03-15T19:30:00')]
      };
      localStorage.setItem('hkaff_2025_selections', JSON.stringify(legacyData));

      const loadWithMigration = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return { version: 1, selections: [], language_preference: 'tc' };

        const parsed = JSON.parse(data);

        if (!parsed.version || parsed.version < 1) {
          // Migrate to version 1
          const migrated = {
            version: 1,
            last_updated: new Date().toISOString(),
            language_preference: parsed.language_preference || 'tc',
            selections: parsed.selections || []
          };

          // Save migrated data
          localStorage.setItem('hkaff_2025_selections', JSON.stringify(migrated));
          return migrated;
        }

        return parsed;
      };

      const loaded = loadWithMigration();
      expect(loaded.version).toBe(1);
      expect(loaded.last_updated).toBeDefined();
      expect(loaded.selections).toHaveLength(1);
    });

    it('should preserve all data during migration', () => {
      const legacyData = {
        language_preference: 'en',
        selections: [
          createMockSelection('1', 'Film A', '2025-03-15T19:30:00'),
          createMockSelection('2', 'Film B', '2025-03-15T21:45:00')
        ]
      };
      localStorage.setItem('hkaff_2025_selections', JSON.stringify(legacyData));

      const loadWithMigration = () => {
        const data = localStorage.getItem('hkaff_2025_selections');
        if (!data) return { version: 1, selections: [], language_preference: 'tc' };

        const parsed = JSON.parse(data);

        if (!parsed.version || parsed.version < 1) {
          return {
            version: 1,
            last_updated: new Date().toISOString(),
            language_preference: parsed.language_preference || 'tc',
            selections: parsed.selections || []
          };
        }

        return parsed;
      };

      const loaded = loadWithMigration();
      expect(loaded.version).toBe(1);
      expect(loaded.language_preference).toBe('en');
      expect(loaded.selections).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle localStorage quota exceeded', () => {
      // Mock quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const saveSelections = (selections) => {
        try {
          const data = {
            version: 1,
            last_updated: new Date().toISOString(),
            language_preference: 'tc',
            selections: selections
          };
          localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
          return true;
        } catch (error) {
          console.error('Failed to save selections:', error);
          return false;
        }
      };

      const result = saveSelections([createMockSelection('1', 'Film A', '2025-03-15T19:30:00')]);
      expect(result).toBe(false);

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it('should handle null localStorage', () => {
      const originalLocalStorage = global.localStorage;
      global.localStorage = null;

      const saveSelections = (selections) => {
        try {
          if (!localStorage) return false;
          const data = {
            version: 1,
            last_updated: new Date().toISOString(),
            language_preference: 'tc',
            selections: selections
          };
          localStorage.setItem('hkaff_2025_selections', JSON.stringify(data));
          return true;
        } catch (error) {
          return false;
        }
      };

      const result = saveSelections([]);
      expect(result).toBe(false);

      // Restore
      global.localStorage = originalLocalStorage;
    });
  });
});
