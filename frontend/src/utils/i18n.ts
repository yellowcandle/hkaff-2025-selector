/**
 * i18n Utility Helper
 *
 * Provides utility functions for internationalization setup and usage
 */

import i18n from '../i18n/config';
import { storageService } from '../services/storageService';

/**
 * Change application language
 * @param language Language code ('tc' or 'en')
 */
export function changeLanguage(language: 'tc' | 'en'): void {
  // Update i18next language (will trigger languageChanged event in config)
  i18n.changeLanguage(language);

  // Also update storageService directly for consistency
  storageService.setLanguage(language);
}

/**
 * Get current language
 * @returns Current language code
 */
export function getCurrentLanguage(): 'tc' | 'en' {
  return (i18n.language as 'tc' | 'en') || 'tc';
}

/**
 * Toggle between TC and EN
 */
export function toggleLanguage(): void {
  const current = getCurrentLanguage();
  const next = current === 'tc' ? 'en' : 'tc';
  changeLanguage(next);
}

export default {
  changeLanguage,
  getCurrentLanguage,
  toggleLanguage
};
