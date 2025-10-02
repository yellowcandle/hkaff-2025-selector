/**
 * E2E Tests for Schedule Management Functionality
 * 
 * These tests validate the user journey for managing the schedule.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T030-T031: Schedule Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('T030: Remove screening from schedule', async ({ page }) => {
    // First select some screenings
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    await firstScreening.locator('[data-testid="select-button"]').click();
    
    // Go back and select second film
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    const secondCard = page.locator('[data-testid="film-card"]').nth(1);
    await secondCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    const secondScreening = page.locator('[data-testid="screening-item"]').first();
    await secondScreening.locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Verify schedule shows 2 selections
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    await expect(scheduleItems).toHaveCount(2);
    
    // Remove first screening
    const firstScheduleItem = scheduleItems.first();
    await expect(firstScheduleItem).toBeVisible();
    
    const removeButton = firstScheduleItem.locator('[data-testid="remove-button"]');
    await expect(removeButton).toBeVisible();
    await removeButton.click();
    
    // Verify confirmation dialog (if implemented)
    const confirmDialog = page.locator('[data-testid="confirm-dialog"]');
    if (await confirmDialog.isVisible()) {
      await confirmDialog.locator('[data-testid="confirm-remove"]').click();
    }
    
    // Verify schedule now shows 1 selection
    await expect(scheduleItems).toHaveCount(1);
    
    // Verify schedule counter updates
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('1');
    
    // Verify LocalStorage updated
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(1);
  });

  test('T031: Detect conflicts in schedule', async ({ page }) => {
    // Select two screenings that overlap
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    // Find a screening at 19:30 (assuming this exists in test data)
    const screenings = page.locator('[data-testid="screening-item"]');
    const screeningCount = await screenings.count();
    
    for (let i = 0; i < screeningCount; i++) {
      const screening = screenings.nth(i);
      const timeText = await screening.locator('[data-testid="screening-time"]').textContent();
      if (timeText && timeText.includes('19:30')) {
        await screening.locator('[data-testid="select-button"]').click();
        break;
      }
    }
    
    // Go back and select another film
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    const secondCard = page.locator('[data-testid="film-card"]').nth(1);
    await secondCard.click();
    
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    // Find another screening at overlapping time (20:00)
    const secondScreenings = page.locator('[data-testid="screening-item"]');
    const secondScreeningCount = await secondScreenings.count();
    
    for (let i = 0; i < secondScreeningCount; i++) {
      const screening = secondScreenings.nth(i);
      const timeText = await screening.locator('[data-testid="screening-time"]').textContent();
      if (timeText && timeText.includes('20:00')) {
        await screening.locator('[data-testid="select-button"]').click();
        break;
      }
    }
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Look for conflict warnings
    const conflictWarnings = page.locator('[data-testid="conflict-warning"]');
    const conflictCount = await conflictWarnings.count();
    
    // Should detect at least one conflict
    expect(conflictCount).toBeGreaterThanOrEqual(1);
    
    // Verify conflict details are shown
    if (conflictCount > 0) {
      const firstWarning = conflictWarnings.first();
      await expect(firstWarning).toBeVisible();
      
      // Should contain overlap information
      const warningText = await firstWarning.textContent();
      expect(warningText).toMatch(/overlap|重疊|conflict|衝突/i);
      
      // Should indicate severity
      await expect(firstWarning.locator('[data-testid="conflict-severity"]')).toBeVisible();
    }
    
    // Verify conflict doesn't prevent selection (both screenings should still be there)
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    await expect(scheduleItems).toHaveCount(2);
  });

  test('Schedule groups screenings by date', async ({ page }) => {
    // Select screenings on different dates
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select multiple films to get different dates
    const filmCards = page.locator('[data-testid="film-card"]');
    const cardCount = await filmCards.count();
    
    for (let i = 0; i < Math.min(3, cardCount); i++) {
      await filmCards.nth(i).click();
      await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
      
      const screenings = page.locator('[data-testid="screening-item"]');
      if (await screenings.count() > 0) {
        await screenings.first().locator('[data-testid="select-button"]').click();
      }
      
      await page.locator('[data-testid="back-button"]').click();
      await page.waitForSelector('[data-testid="film-grid"]');
    }
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Look for date groups
    const dateGroups = page.locator('[data-testid="date-group"]');
    const dateGroupCount = await dateGroups.count();
    expect(dateGroupCount).toBeGreaterThan(0);
    
    // Each date group should have a date header
    for (let i = 0; i < dateGroupCount; i++) {
      const dateGroup = dateGroups.nth(i);
      await expect(dateGroup.locator('[data-testid="date-header"]')).toBeVisible();
      
      // Should have screenings under each date
      const screeningsInGroup = dateGroup.locator('[data-testid="schedule-item"]');
      const screeningCount = await screeningsInGroup.count();
      expect(screeningCount).toBeGreaterThan(0);
    }
    
    // Screenings within each date should be sorted by time
    for (let i = 0; i < dateGroupCount; i++) {
      const dateGroup = dateGroups.nth(i);
      const screeningsInGroup = dateGroup.locator('[data-testid="schedule-item"]');
      const screeningCount = await screeningsInGroup.count();
      
      const times = [];
      for (let j = 0; j < screeningCount; j++) {
        const screening = screeningsInGroup.nth(j);
        const timeText = await screening.locator('[data-testid="screening-time"]').textContent();
        times.push(timeText);
      }
      
      // Verify times are in ascending order
      for (let j = 1; j < times.length; j++) {
        expect(times[j]).toBeGreaterThanOrEqual(times[j - 1]);
      }
    }
  });

  test('Clear all selections', async ({ page }) => {
    // Select some screenings first
    await page.waitForSelector('[data-testid="film-grid"]');
    
    const filmCards = page.locator('[data-testid="film-card"]');
    await filmCards.first().click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    await page.locator('[data-testid="back-button"]').click();
    await filmCards.nth(1).click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Verify there are selections
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    await expect(scheduleItems).toHaveCount(2);
    
    // Clear all selections
    await page.locator('[data-testid="clear-all-button"]').click();
    
    // Confirm if dialog appears
    const confirmDialog = page.locator('[data-testid="confirm-dialog"]');
    if (await confirmDialog.isVisible()) {
      await confirmDialog.locator('[data-testid="confirm-clear"]').click();
    }
    
    // Verify schedule is empty
    await expect(scheduleItems).toHaveCount(0);
    
    // Verify empty state message
    await expect(page.locator('[data-testid="empty-schedule"]')).toBeVisible();
    
    // Verify schedule counter shows 0
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('0');
    
    // Verify LocalStorage is cleared
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(0);
  });
});