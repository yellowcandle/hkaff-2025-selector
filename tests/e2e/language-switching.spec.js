/**
 * E2E Tests for Language Switching Functionality
 * 
 * These tests validate the user journey for switching between TC/EN.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T032: Language Switching E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
  });

  test('Switch from Traditional Chinese to English', async ({ page }) => {
    // Verify default language is Traditional Chinese
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await expect(firstCard).toBeVisible();
    
    const title = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(title).toMatch(/[\u4e00-\u9fff]/); // Contains Chinese characters
    
    // Find and click language toggle
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();
    await languageToggle.click();
    
    // Wait for language options
    await page.waitForSelector('[data-testid="language-option"]');
    
    // Click English option
    const englishOption = page.locator('[data-testid="language-option"]:has-text("EN")');
    await expect(englishOption).toBeVisible();
    await englishOption.click();
    
    // Wait for language to switch
    await page.waitForTimeout(500);
    
    // Verify film title is now in English
    const englishTitle = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(englishTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/); // English characters only
    
    // Verify UI elements are in English
    const filterPanel = page.locator('[data-testid="filter-panel"]');
    await expect(filterPanel).toBeVisible();
    
    // Check category filter label
    const categoryLabel = page.locator('[data-testid="category-label"]');
    const categoryText = await categoryLabel.textContent();
    expect(categoryText.toLowerCase()).toContain('categor');
    
    // Check venue filter label
    const venueLabel = page.locator('[data-testid="venue-label"]');
    const venueText = await venueLabel.textContent();
    expect(venueText.toLowerCase()).toContain('venue');
  });

  test('Language preference persists across page reload', async ({ page }) => {
    // Switch to English first
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Verify language is English
    const firstCard = page.locator('[data-testid="film-card"]').first();
    const title = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(title).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Verify language is still English after reload
    const reloadedTitle = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(reloadedTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Verify language toggle shows English as active
    const activeLanguage = page.locator('[data-testid="active-language"]');
    await expect(activeLanguage).toHaveText('EN');
    
    // Verify LocalStorage saves language preference
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.preferences.language).toBe('en');
  });

  test('Switch back to Traditional Chinese', async ({ page }) => {
    // First switch to English
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Verify English is active
    const firstCard = page.locator('[data-testid="film-card"]').first();
    const englishTitle = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(englishTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Switch back to Traditional Chinese
    await languageToggle.click();
    await page.waitForSelector('[data-testid="language-option"]');
    const tcOption = page.locator('[data-testid="language-option"]:has-text("繁")');
    await expect(tcOption).toBeVisible();
    await tcOption.click();
    await page.waitForTimeout(500);
    
    // Verify Chinese is active again
    const chineseTitle = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(chineseTitle).toMatch(/[\u4e00-\u9fff]/);
    
    // Verify UI elements are in Chinese
    const categoryLabel = page.locator('[data-testid="category-label"]');
    const categoryText = await categoryLabel.textContent();
    expect(categoryText).toMatch(/[\u4e00-\u9fff]/);
    
    // Verify language toggle shows Chinese as active
    const activeLanguage = page.locator('[data-testid="active-language"]');
    await expect(activeLanguage).toHaveText('繁');
  });

  test('Language switching works in film detail view', async ({ page }) => {
    // Click on first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    // Verify detail view is in Chinese by default
    const detailTitle = await page.locator('[data-testid="film-detail-title"]').textContent();
    expect(detailTitle).toMatch(/[\u4e00-\u9fff]/);
    
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Verify detail view switches to English
    const englishDetailTitle = await page.locator('[data-testid="film-detail-title"]').textContent();
    expect(englishDetailTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Verify other detail elements are in English
    const synopsisLabel = page.locator('[data-testid="synopsis-label"]');
    const synopsisText = await synopsisLabel.textContent();
    expect(synopsisText.toLowerCase()).toContain('synopsis');
    
    const directorLabel = page.locator('[data-testid="director-label"]');
    const directorText = await directorLabel.textContent();
    expect(directorText.toLowerCase()).toContain('director');
  });

  test('Language switching works in schedule view', async ({ page }) => {
    // First select a screening to have schedule content
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Verify schedule view is in Chinese by default
    const scheduleTitle = await page.locator('[data-testid="schedule-title"]').textContent();
    expect(scheduleTitle).toMatch(/[\u4e00-\u9fff]/);
    
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Verify schedule view switches to English
    const englishScheduleTitle = await page.locator('[data-testid="schedule-title"]').textContent();
    expect(englishScheduleTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    expect(englishScheduleTitle.toLowerCase()).toContain('schedule');
    
    // Verify schedule items show English venue names
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    if (await scheduleItems.count() > 0) {
      const firstItem = scheduleItems.first();
      const venueName = await firstItem.locator('[data-testid="venue-name"]').textContent();
      expect(venueName).toMatch(/^[A-Za-z0-9\s\-\']+$/);
    }
  });

  test('Language switching is instant and does not lose data', async ({ page }) => {
    // Select some screenings first
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Note the schedule count
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const countBefore = await scheduleCounter.textContent();
    expect(countBefore).toBe('1');
    
    // Switch language multiple times quickly
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid="language-toggle"]').click();
      await page.waitForSelector('[data-testid="language-option"]');
      
      if (i % 2 === 0) {
        await page.locator('[data-testid="language-option"]:has-text("EN")').click();
      } else {
        await page.locator('[data-testid="language-option"]:has-text("繁")').click();
      }
      
      await page.waitForTimeout(200); // Short wait for language switch
      
      // Verify schedule count is preserved
      const countDuring = await scheduleCounter.textContent();
      expect(countDuring).toBe('1');
    }
    
    // Final verification - data is still there
    const countAfter = await scheduleCounter.textContent();
    expect(countAfter).toBe('1');
    
    // Verify LocalStorage still has the selection
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(1);
  });
});