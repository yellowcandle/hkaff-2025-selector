/**
 * T033: Persistence E2E Tests
 *
 * Tests based on quickstart.md scenario 9:
 * - LocalStorage persistence
 * - Selections survive page reload
 * - Language preference maintained
 *
 * These tests will FAIL until UI is implemented (expected behavior in TDD)
 */

import { test, expect } from '@playwright/test';

test.describe('T033: Persistence Across Sessions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
  });

  test('should persist selections in LocalStorage', async ({ page }) => {
    // Select a screening
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });

    const selectButton = page.locator('[data-testid="screening-item"]')
      .first()
      .locator('[data-testid="select-screening-btn"]');
    await selectButton.click();
    await page.waitForTimeout(300);

    // Verify LocalStorage has data
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('hkaff-selections');
    });

    expect(storageData).not.toBeNull();

    const parsed = JSON.parse(storageData!);
    expect(parsed.version).toBe(1);
    expect(parsed.selections).toBeDefined();
    expect(parsed.selections.length).toBeGreaterThan(0);
  });

  test('should restore selections after page reload', async ({ page }) => {
    // Select two screenings
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await page.locator('[data-testid="film-card"]').nth(1).click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');

    // Get schedule counter before reload
    const counterBefore = await page.locator('[data-testid="schedule-counter"]').textContent();
    const countBefore = parseInt(counterBefore || '0');

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify schedule counter matches
    const counterAfter = await page.locator('[data-testid="schedule-counter"]').textContent();
    const countAfter = parseInt(counterAfter || '0');

    expect(countAfter).toBe(countBefore);
    expect(countAfter).toBeGreaterThanOrEqual(2);
  });

  test('should display same schedule after reload', async ({ page }) => {
    // Add selections and navigate to schedule
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Get first screening details
    const firstScreening = page.locator('[data-testid="schedule-item"]').first();
    const filmTitle = await firstScreening.locator('[data-testid="schedule-film-title"]').textContent();
    const screeningTime = await firstScreening.locator('[data-testid="schedule-time"]').textContent();

    // Reload and navigate back to schedule
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Verify same screening is displayed
    const firstScreeningAfter = page.locator('[data-testid="schedule-item"]').first();
    const filmTitleAfter = await firstScreeningAfter.locator('[data-testid="schedule-film-title"]').textContent();
    const screeningTimeAfter = await firstScreeningAfter.locator('[data-testid="schedule-time"]').textContent();

    expect(filmTitleAfter).toBe(filmTitle);
    expect(screeningTimeAfter).toBe(screeningTime);
  });

  test('should persist language preference', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Verify English is active
    const htmlLangBefore = await page.locator('html').getAttribute('lang');
    expect(htmlLangBefore).toBe('en');

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify still in English
    const htmlLangAfter = await page.locator('html').getAttribute('lang');
    expect(htmlLangAfter).toBe('en');
  });

  test('should maintain language preference in LocalStorage', async ({ page }) => {
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Check LocalStorage before reload
    const langBefore = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      return data ? JSON.parse(data).preferences?.language : null;
    });

    expect(langBefore).toBe('en');

    // Reload
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Check LocalStorage after reload
    const langAfter = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      return data ? JSON.parse(data).preferences?.language : null;
    });

    expect(langAfter).toBe('en');
  });

  test('should preserve selections after closing and reopening tab', async ({ page, context }) => {
    // Add a selection
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');

    // Get LocalStorage data
    const storageBefore = await page.evaluate(() => {
      return localStorage.getItem('hkaff-selections');
    });

    // Close page
    await page.close();

    // Open new page in same context (shares LocalStorage)
    const newPage = await context.newPage();
    await newPage.goto('/');
    await newPage.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify LocalStorage persisted
    const storageAfter = await newPage.evaluate(() => {
      return localStorage.getItem('hkaff-selections');
    });

    expect(storageAfter).toBe(storageBefore);

    // Verify schedule counter shows selections
    const counter = await newPage.locator('[data-testid="schedule-counter"]').textContent();
    const count = parseInt(counter || '0');
    expect(count).toBeGreaterThan(0);

    await newPage.close();
  });

  test('should NOT persist after LocalStorage is cleared', async ({ page }) => {
    // Add a selection
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');

    // Verify selection exists
    const counterBefore = await page.locator('[data-testid="schedule-counter"]').textContent();
    expect(parseInt(counterBefore || '0')).toBeGreaterThan(0);

    // Clear LocalStorage
    await page.evaluate(() => localStorage.clear());

    // Reload
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify selections are gone
    const counterAfter = await page.locator('[data-testid="schedule-counter"]').textContent();
    expect(parseInt(counterAfter || '0')).toBe(0);
  });

  test('should handle corrupted LocalStorage gracefully', async ({ page }) => {
    // Set invalid JSON in LocalStorage
    await page.evaluate(() => {
      localStorage.setItem('hkaff-selections', 'invalid-json-{{{');
    });

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // App should still load (with empty state)
    const filmGrid = page.locator('[data-testid="film-grid"]');
    await expect(filmGrid).toBeVisible();

    // Counter should be 0
    const counter = await page.locator('[data-testid="schedule-counter"]').textContent();
    expect(parseInt(counter || '0')).toBe(0);
  });

  test('should preserve timestamp metadata on selections', async ({ page }) => {
    // Add a selection
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.waitForTimeout(300);

    // Get timestamp before reload
    const timestampBefore = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.selections[0]?.added_at;
      }
      return null;
    });

    expect(timestampBefore).not.toBeNull();

    // Reload
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Get timestamp after reload
    const timestampAfter = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.selections[0]?.added_at;
      }
      return null;
    });

    // Should be exactly the same
    expect(timestampAfter).toBe(timestampBefore);
  });

  test('should maintain snapshot data for films and screenings', async ({ page }) => {
    // Add a selection
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.waitForTimeout(300);

    // Get snapshot data before reload
    const snapshotBefore = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      if (data) {
        const parsed = JSON.parse(data);
        return {
          film: parsed.selections[0]?.film_snapshot,
          screening: parsed.selections[0]?.screening_snapshot
        };
      }
      return null;
    });

    expect(snapshotBefore).not.toBeNull();
    expect(snapshotBefore?.film).toBeDefined();
    expect(snapshotBefore?.screening).toBeDefined();

    // Reload
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Get snapshot data after reload
    const snapshotAfter = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      if (data) {
        const parsed = JSON.parse(data);
        return {
          film: parsed.selections[0]?.film_snapshot,
          screening: parsed.selections[0]?.screening_snapshot
        };
      }
      return null;
    });

    // Snapshots should be identical
    expect(snapshotAfter).toEqual(snapshotBefore);
  });
});
