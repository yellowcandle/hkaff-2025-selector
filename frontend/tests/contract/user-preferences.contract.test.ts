import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UserPreferencesManager } from '../../src/services/preferencesService';
import type { UserPreferences } from '../../src/types';

/**
 * T005: Contract test for UserPreferencesManager interface.
 * Tests that any implementation of UserPreferencesManager behaves correctly.
 */
describe('T005: UserPreferencesManager contract (frontend/tests/contract/user-preferences.contract.test.ts)', () => {
  let mockService: UserPreferencesManager;
  let mockPreferences: UserPreferences;

  beforeEach(() => {
    mockPreferences = {
      language: 'tc',
      theme: 'light',
      notifications: true,
      autoSave: false
    };

    // Create mock service
    mockService = {
      getPreferences: vi.fn().mockReturnValue(mockPreferences),
      updatePreferences: vi.fn(),
      getPreference: vi.fn().mockImplementation((key: keyof UserPreferences) => mockPreferences[key]),
      setPreference: vi.fn(),
      resetToDefaults: vi.fn()
    };
  });

  it('enforces UserPreferencesManager contract requirements', () => {
    // Test getPreferences returns current preferences
    const preferences = mockService.getPreferences();
    expect(preferences).toEqual(mockPreferences);
    expect(mockService.getPreferences).toHaveBeenCalledTimes(1);

    // Test getPreference returns specific preference value
    const language = mockService.getPreference('language');
    expect(language).toBe('tc');
    expect(mockService.getPreference).toHaveBeenCalledWith('language');

    const theme = mockService.getPreference('theme');
    expect(theme).toBe('light');

    const notifications = mockService.getPreference('notifications');
    expect(notifications).toBe(true);

    const autoSave = mockService.getPreference('autoSave');
    expect(autoSave).toBe(false);

    // Test setPreference updates specific preference
    mockService.setPreference('language', 'en');
    expect(mockService.setPreference).toHaveBeenCalledWith('language', 'en');

    mockService.setPreference('theme', 'dark');
    expect(mockService.setPreference).toHaveBeenCalledWith('theme', 'dark');

    // Test updatePreferences updates multiple preferences
    const updates = { language: 'en', theme: 'dark' };
    mockService.updatePreferences(updates);
    expect(mockService.updatePreferences).toHaveBeenCalledWith(updates);

    // Test resetToDefaults resets preferences
    mockService.resetToDefaults();
    expect(mockService.resetToDefaults).toHaveBeenCalledTimes(1);
  });
});
