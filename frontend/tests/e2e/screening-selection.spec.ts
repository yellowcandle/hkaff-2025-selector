/**
 * T029: Screening Selection E2E Tests
 *
 * Tests based on quickstart.md scenario 4:
 * - View film details
 * - Select screening
 * - Verify schedule counter updates
 *
 * These tests will FAIL until UI is implemented (expected behavior in TDD)
 */

import { test, expect } from '@playwright/test';

test.describe('T029: Screening Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
  });

  test('should open film detail modal when clicking film card', async ({ page }) => {
    // Click on first film card
    const firstFilm = page.locator('[data-testid="film-card"]').first();
    await firstFilm.click();

    // Verify modal/detail page opens
    const filmDetail = page.locator('[data-testid="film-detail-modal"]');
    await expect(filmDetail).toBeVisible({ timeout: 2000 });
  });

  test('should display film details in modal', async ({ page }) => {
    // Open film detail
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="film-detail-modal"]', { timeout: 2000 });

    const modal = page.locator('[data-testid="film-detail-modal"]');

    // Verify film details are shown
    await expect(modal.locator('[data-testid="film-synopsis"]')).toBeVisible();
    await expect(modal.locator('[data-testid="film-director"]')).toBeVisible();
    await expect(modal.locator('[data-testid="film-runtime"]')).toBeVisible();
    await expect(modal.locator('[data-testid="film-country"]')).toBeVisible();
  });

  test('should display list of available screenings', async ({ page }) => {
    // Open film detail
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="film-detail-modal"]', { timeout: 2000 });

    // Verify screenings list
    const screeningsList = page.locator('[data-testid="screenings-list"]');
    await expect(screeningsList).toBeVisible();

    // Verify screening items show date, time, venue
    const screenings = page.locator('[data-testid="screening-item"]');
    const count = await screenings.count();
    expect(count).toBeGreaterThan(0);

    // Check first screening has required info
    const firstScreening = screenings.first();
    await expect(firstScreening.locator('[data-testid="screening-datetime"]')).toBeVisible();
    await expect(firstScreening.locator('[data-testid="screening-venue"]')).toBeVisible();
  });

  test('should select screening and update schedule counter', async ({ page }) => {
    // Get initial schedule counter value
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const initialCountText = await scheduleCounter.textContent();
    const initialCount = parseInt(initialCountText || '0');

    // Open film detail and select screening
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });

    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    const selectButton = firstScreening.locator('[data-testid="select-screening-btn"]');

    await selectButton.click();

    // Verify counter increments
    await page.waitForTimeout(200); // Allow state update
    const newCountText = await scheduleCounter.textContent();
    const newCount = parseInt(newCountText || '0');

    expect(newCount).toBe(initialCount + 1);
  });

  test('should change select button to "Selected" state', async ({ page }) => {
    // Open film detail
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });

    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    const selectButton = firstScreening.locator('[data-testid="select-screening-btn"]');

    // Verify initial state (e.g., "Select" or "選擇")
    const initialText = await selectButton.textContent();
    expect(initialText).toMatch(/Select|選擇/i);

    // Click to select
    await selectButton.click();
    await page.waitForTimeout(200);

    // Verify button text changes (e.g., "Selected" or "已選擇")
    const selectedText = await selectButton.textContent();
    expect(selectedText).toMatch(/Selected|已選擇/i);

    // Verify visual feedback (could be disabled, different color, etc.)
    const isDisabled = await selectButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should persist selection in LocalStorage', async ({ page }) => {
    // Select a screening
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });

    const selectButton = page.locator('[data-testid="screening-item"]')
      .first()
      .locator('[data-testid="select-screening-btn"]');

    await selectButton.click();
    await page.waitForTimeout(300);

    // Check LocalStorage
    const storageData = await page.evaluate(() => {
      const data = localStorage.getItem('hkaff-selections');
      return data ? JSON.parse(data) : null;
    });

    expect(storageData).not.toBeNull();
    expect(storageData.version).toBe(1);
    expect(storageData.selections).toBeDefined();
    expect(Array.isArray(storageData.selections)).toBe(true);
    expect(storageData.selections.length).toBeGreaterThan(0);

    // Verify selection structure
    const firstSelection = storageData.selections[0];
    expect(firstSelection).toHaveProperty('screening_id');
    expect(firstSelection).toHaveProperty('added_at');
    expect(firstSelection).toHaveProperty('film_snapshot');
    expect(firstSelection).toHaveProperty('screening_snapshot');
  });

  test('should close modal and return to film grid', async ({ page }) => {
    // Open film detail
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="film-detail-modal"]', { timeout: 2000 });

    // Close modal (click close button or outside)
    const closeButton = page.locator('[data-testid="close-modal-btn"]');

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Try clicking backdrop
      await page.keyboard.press('Escape');
    }

    // Verify modal is closed
    await page.waitForTimeout(300);
    const modal = page.locator('[data-testid="film-detail-modal"]');
    await expect(modal).not.toBeVisible();

    // Verify film grid is still visible
    const filmGrid = page.locator('[data-testid="film-grid"]');
    await expect(filmGrid).toBeVisible();
  });

  test('should prevent duplicate selections', async ({ page }) => {
    // Select a screening
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });

    const selectButton = page.locator('[data-testid="screening-item"]')
      .first()
      .locator('[data-testid="select-screening-btn"]');

    await selectButton.click();
    await page.waitForTimeout(200);

    // Get schedule count
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const countAfterFirst = await scheduleCounter.textContent();

    // Try to click again (should be disabled or do nothing)
    const isDisabled = await selectButton.isDisabled();

    if (!isDisabled) {
      await selectButton.click();
      await page.waitForTimeout(200);

      const countAfterSecond = await scheduleCounter.textContent();
      expect(countAfterSecond).toBe(countAfterFirst); // No change
    }
  });

  test('should handle multiple film selections', async ({ page }) => {
    // Select from first film
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Select from second film
    await page.locator('[data-testid="film-card"]').nth(1).click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    // Verify schedule counter shows 2
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const countText = await scheduleCounter.textContent();
    const count = parseInt(countText || '0');

    expect(count).toBeGreaterThanOrEqual(2);
  });
});
