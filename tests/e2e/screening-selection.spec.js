/**
 * E2E Tests for Screening Selection Functionality
 * 
 * These tests validate the user journey for selecting screenings.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T029: Screening Selection E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
  });

  test('Select screening from film detail', async ({ page }) => {
    // Click on first film to view details
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    // Wait for film detail to load
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.waitForSelector('[data-testid="screening-item"]');
    
    // Get initial schedule count (should be 0)
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    await expect(scheduleCounter).toBeVisible();
    const initialCount = await scheduleCounter.textContent();
    expect(initialCount).toBe('0');
    
    // Find first screening and click select button
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    await expect(firstScreening).toBeVisible();
    
    const selectButton = firstScreening.locator('[data-testid="select-button"]');
    await expect(selectButton).toBeVisible();
    await expect(selectButton).toHaveText('Select'); // or '選擇' in TC
    
    // Click to select screening
    await selectButton.click();
    
    // Verify button changes to "Selected" / '已選'
    await expect(selectButton).toHaveText(/Selected|已選/);
    
    // Verify schedule counter increments
    const updatedCount = await scheduleCounter.textContent();
    expect(updatedCount).toBe('1');
    
    // Verify selection persists in LocalStorage
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(1);
    expect(localStorageData.selections[0]).toHaveProperty('screening_id');
    expect(localStorageData.selections[0]).toHaveProperty('added_at');
    expect(localStorageData.selections[0]).toHaveProperty('film_snapshot');
    expect(localStorageData.selections[0]).toHaveProperty('screening_snapshot');
  });

  test('Cannot select same screening twice', async ({ page }) => {
    // Click on first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.waitForSelector('[data-testid="screening-item"]');
    
    // Select first screening
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    const selectButton = firstScreening.locator('[data-testid="select-button"]');
    await selectButton.click();
    
    // Verify button shows "Selected"
    await expect(selectButton).toHaveText(/Selected|已選/);
    
    // Try to click again - should not create duplicate
    await selectButton.click();
    
    // Verify still only 1 selection
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('1');
    
    // Verify LocalStorage still has only 1 selection
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(1);
  });

  test('Select multiple screenings from different films', async ({ page }) => {
    // Select screening from first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    await firstScreening.locator('[data-testid="select-button"]').click();
    
    // Go back to film list
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select screening from second film
    const secondCard = page.locator('[data-testid="film-card"]').nth(1);
    await secondCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const secondScreening = page.locator('[data-testid="screening-item"]').first();
    await secondScreening.locator('[data-testid="select-button"]').click();
    
    // Verify schedule counter shows 2
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('2');
    
    // Verify LocalStorage has 2 selections
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(2);
    
    // Verify selections are for different films
    const filmIds = localStorageData.selections.map(s => s.film_snapshot.id);
    const uniqueFilmIds = [...new Set(filmIds)];
    expect(uniqueFilmIds).toHaveLength(2);
  });

  test('Screening selection persists across page reload', async ({ page }) => {
    // Select a screening
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    await firstScreening.locator('[data-testid="select-button"]').click();
    
    // Verify selection is made
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const countBefore = await scheduleCounter.textContent();
    expect(countBefore).toBe('1');
    
    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Verify schedule counter still shows 1
    const countAfter = await scheduleCounter.textContent();
    expect(countAfter).toBe('1');
    
    // Go to film detail and verify button shows "Selected"
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const selectButton = firstScreening.locator('[data-testid="select-button"]');
    await expect(selectButton).toHaveText(/Selected|已選/);
  });
});