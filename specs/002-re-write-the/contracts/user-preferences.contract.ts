// Contract: User Preferences Management
// Ensures consistent interface for user preferences storage and retrieval

export interface UserPreferencesManager {
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(preferences: Partial<UserPreferences>): Promise<void>;
  resetPreferences(): Promise<void>;
}

export interface UserPreferences {
  language: 'tc' | 'en';
  theme?: string;
  notifications: boolean;
}

// Contract Tests
describe('UserPreferencesManager Contract', () => {
  let manager: UserPreferencesManager;

  beforeEach(() => {
    manager = {} as UserPreferencesManager;
  });

  it('should get user preferences', async () => {
    const prefs = await manager.getPreferences();
    expect(prefs).toHaveProperty('language');
    expect(['tc', 'en']).toContain(prefs.language);
  });

  it('should update preferences', async () => {
    const newPrefs = { language: 'en' as const };
    await manager.updatePreferences(newPrefs);
    const updated = await manager.getPreferences();
    expect(updated.language).toBe('en');
  });

  it('should reset preferences', async () => {
    await manager.resetPreferences();
    const prefs = await manager.getPreferences();
    expect(prefs.language).toBe('en'); // default
  });
});