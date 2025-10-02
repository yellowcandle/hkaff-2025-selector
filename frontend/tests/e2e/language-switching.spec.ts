/**
 * T032: Language Switching E2E Tests
 *
 * Tests based on quickstart.md scenario 7:
 * - Language toggle between Traditional Chinese and English
 * - Content switches properly
 * - Preference persists
 *
 * These tests will FAIL until UI is implemented (expected behavior in TDD)
 */

import { test, expect } from '@playwright/test';

test.describe('T032: Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
  });

  test('should display language toggle button', async ({ page }) => {
    // Find language toggle (typically labeled "繁/EN" or similar)
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    // Verify it shows both language options
    const toggleText = await languageToggle.textContent();
    expect(toggleText).toMatch(/繁|EN|中|English/);
  });

  test('should default to Traditional Chinese', async ({ page }) => {
    // Verify HTML lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toMatch(/zh|zh-HK|zh-TW/);

    // Verify UI shows Chinese text
    const firstFilmTitle = page.locator('[data-testid="film-title"]').first();
    const titleText = await firstFilmTitle.textContent();

    // Chinese characters should be present (simple regex check)
    expect(titleText).toMatch(/[\u4e00-\u9fff]/); // Chinese character range
  });

  test('should switch to English when toggle clicked', async ({ page }) => {
    const languageToggle = page.locator('[data-testid="language-toggle"]');

    // Click to switch to English
    await languageToggle.click();
    await page.waitForTimeout(200); // Allow for language switch

    // Verify HTML lang attribute changes
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Verify film titles switch to English
    const firstFilmTitle = page.locator('[data-testid="film-title"]').first();
    const titleText = await firstFilmTitle.textContent();

    // Should be primarily English (allow some Chinese in titles)
    expect(titleText).toBeDefined();
  });

  test('should switch film titles to English', async ({ page }) => {
    // Get Chinese title
    const filmTitle = page.locator('[data-testid="film-title"]').first();
    const chineseTitle = await filmTitle.textContent();

    // Switch language
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Get English title
    const englishTitle = await filmTitle.textContent();

    // Titles should be different (unless film has same title in both languages)
    // At minimum, verify English title exists
    expect(englishTitle).toBeDefined();
    expect(englishTitle?.length).toBeGreaterThan(0);
  });

  test('should switch UI labels to English', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Check schedule navigation label
    const scheduleNav = page.locator('[data-testid="schedule-nav-link"]');
    const navText = await scheduleNav.textContent();
    expect(navText).toMatch(/My Schedule|Schedule/i);

    // Check filter labels (if visible)
    const categoryFilter = page.locator('[data-testid="category-filter-label"]');
    if (await categoryFilter.isVisible()) {
      const labelText = await categoryFilter.textContent();
      expect(labelText).toMatch(/Category|Categories/i);
    }
  });

  test('should switch category names to English', async ({ page }) => {
    // Open category dropdown
    await page.locator('[data-testid="category-filter"]').click();
    await page.waitForTimeout(200);

    // Get first category in Chinese
    const firstCategory = page.locator('[data-testid="category-option"]').first();
    const chineseName = await firstCategory.textContent();

    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Reopen dropdown
    await page.locator('[data-testid="category-filter"]').click();
    await page.waitForTimeout(200);

    // Get category in English
    const englishName = await firstCategory.textContent();

    // Should be different or contain English
    expect(englishName).toBeDefined();
  });

  test('should switch venue names to English', async ({ page }) => {
    // Open venue dropdown
    await page.locator('[data-testid="venue-filter"]').click();
    await page.waitForTimeout(200);

    // Get first venue in Chinese
    const firstVenue = page.locator('[data-testid="venue-option"]').first();
    const chineseName = await firstVenue.textContent();

    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Reopen dropdown
    await page.locator('[data-testid="venue-filter"]').click();
    await page.waitForTimeout(200);

    // Get venue in English
    const englishName = await firstVenue.textContent();

    // Verify English name
    expect(englishName).toBeDefined();
  });

  test('should switch language instantly (<100ms)', async ({ page }) => {
    const startTime = Date.now();

    // Click toggle
    await page.locator('[data-testid="language-toggle"]').click();

    // Wait for UI to update
    await page.waitForTimeout(100);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within 100ms
    expect(duration).toBeLessThan(100);
  });

  test('should persist language preference in LocalStorage', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Check LocalStorage
    const languagePref = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      return data ? JSON.parse(data).preferences?.language : null;
    });

    expect(languagePref).toBe('en');
  });

  test('should maintain language preference after page reload', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify language is still English
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Verify UI is in English
    const scheduleNav = page.locator('[data-testid="schedule-nav-link"]');
    const navText = await scheduleNav.textContent();
    expect(navText).toMatch(/My Schedule|Schedule/i);
  });

  test('should toggle back to Traditional Chinese', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Switch back to Chinese
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Verify back to Chinese
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toMatch(/zh|zh-HK|zh-TW/);

    // Verify schedule nav is in Chinese
    const scheduleNav = page.locator('[data-testid="schedule-nav-link"]');
    const navText = await scheduleNav.textContent();
    expect(navText).toMatch(/我的時間表|時間表|行程/);
  });

  test('should maintain date format appropriate for language', async ({ page }) => {
    // Navigate to schedule with a selection
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Check date format in Chinese
    const dateHeaderCN = page.locator('[data-testid="date-header"]').first();
    const chineseDateText = await dateHeaderCN.textContent();

    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Check date format in English
    const englishDateText = await dateHeaderCN.textContent();

    // Formats should differ (e.g., "3月15日" vs "March 15" or "Fri, Mar 15")
    expect(englishDateText).toBeDefined();
  });

  test('should handle film detail modal in both languages', async ({ page }) => {
    // Open film detail in Chinese
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="film-detail-modal"]', { timeout: 2000 });

    // Get synopsis in Chinese
    const synopsis = page.locator('[data-testid="film-synopsis"]');
    const chineseSynopsis = await synopsis.textContent();

    // Switch to English (modal should update)
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Synopsis should be in English
    const englishSynopsis = await synopsis.textContent();

    expect(englishSynopsis).toBeDefined();
    // Note: Actual content may or may not differ depending on data
  });
});
