/**
 * E2E Tests for Data Persistence Functionality
 * 
 * These tests validate that user data persists across sessions.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T033: Persistence E2E Tests', () => {
  test('Selections persist across browser sessions', async ({ page, context }) => {
    // Navigate to app and make selections
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select first film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    const firstScreening = page.locator('[data-testid="screening-item"]').first();
    await firstScreening.locator('[data-testid="select-button"]').click();
    
    // Select second film
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    const secondCard = page.locator('[data-testid="film-card"]').nth(1);
    await secondCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    const secondScreening = page.locator('[data-testid="screening-item"]').first();
    await secondScreening.locator('[data-testid="select-button"]').click();
    
    // Verify selections are made
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('2');
    
    // Get LocalStorage data for verification
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections).toHaveLength(2);
    
    // Store selection IDs for later verification
    const selectionIds = localStorageData.selections.map(s => s.screening_id);
    
    // Close current page and open new one (simulates closing browser)
    await page.close();
    
    // Create new page in same context (same browser, new tab)
    const newPage = await context.newPage();
    await newPage.goto('http://localhost:5173');
    await newPage.waitForSelector('[data-testid="film-grid"]');
    
    // Verify selections persisted
    const newScheduleCounter = newPage.locator('[data-testid="schedule-counter"]');
    const newCount = await newScheduleCounter.textContent();
    expect(newCount).toBe('2');
    
    // Verify LocalStorage data is intact
    const newLocalStorageData = await newPage.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(newLocalStorageData.selections).toHaveLength(2);
    
    // Verify same selections are present
    const newSelectionIds = newLocalStorageData.selections.map(s => s.screening_id);
    expect(newSelectionIds).toEqual(expect.arrayContaining(selectionIds));
    
    // Navigate to schedule view to verify details
    await newPage.locator('[data-testid="schedule-tab"]').click();
    await expect(newPage.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    const scheduleItems = newPage.locator('[data-testid="schedule-item"]');
    await expect(scheduleItems).toHaveCount(2);
    
    // Verify film details are preserved in snapshots
    for (let i = 0; i < 2; i++) {
      const item = scheduleItems.nth(i);
      await expect(item.locator('[data-testid="film-title"]')).toBeVisible();
      await expect(item.locator('[data-testid="venue-name"]')).toBeVisible();
      await expect(item.locator('[data-testid="screening-time"]')).toBeVisible();
    }
  });

  test('Language preference persists across sessions', async ({ page, context }) => {
    // Navigate to app and switch to English
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Switch language to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Verify language is English
    const firstCard = page.locator('[data-testid="film-card"]').first();
    const title = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(title).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Verify language preference is saved
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.preferences.language).toBe('en');
    
    // Close and reopen
    await page.close();
    
    const newPage = await context.newPage();
    await newPage.goto('http://localhost:5173');
    await newPage.waitForSelector('[data-testid="film-grid"]');
    
    // Verify language is still English
    const newTitle = await newPage.locator('[data-testid="film-card"]').first()
      .locator('[data-testid="film-title"]').textContent();
    expect(newTitle).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/);
    
    // Verify language preference persisted
    const newLocalStorageData = await newPage.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(newLocalStorageData.preferences.language).toBe('en');
  });

  test('Data survives browser restart simulation', async ({ browser }) => {
    // Create isolated context to simulate browser restart
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Make selections and set preferences
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Select a film
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-button"]').click();
    
    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Get data for verification
    const originalData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(originalData.selections).toHaveLength(1);
    expect(originalData.preferences.language).toBe('en');
    
    // Close context (simulates browser closing)
    await context.close();
    
    // Create new context (simulates browser restart)
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    
    // Navigate to app
    await newPage.goto('http://localhost:5173');
    await newPage.waitForSelector('[data-testid="film-grid"]');
    
    // Verify data persisted
    const persistedData = await newPage.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(persistedData.selections).toHaveLength(1);
    expect(persistedData.preferences.language).toBe('en');
    
    // Verify selection details are intact
    expect(persistedData.selections[0]).toHaveProperty('screening_id');
    expect(persistedData.selections[0]).toHaveProperty('film_snapshot');
    expect(persistedData.selections[0]).toHaveProperty('screening_snapshot');
    expect(persistedData.selections[0].film_snapshot).toHaveProperty('title_en');
    expect(persistedData.selections[0].film_snapshot).toHaveProperty('title_tc');
    
    await newContext.close();
  });

  test('LocalStorage quota handling', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Monitor console for quota exceeded errors
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.text().includes('quota') || msg.text().includes('storage')) {
        consoleMessages.push(msg.text());
      }
    });
    
    // Try to fill up LocalStorage (this is more of a stress test)
    // In practice, users won't hit this limit with normal usage
    const filmCards = page.locator('[data-testid="film-card"]');
    const cardCount = await filmCards.count();
    
    // Select many films (up to available)
    for (let i = 0; i < Math.min(cardCount, 20); i++) {
      await filmCards.nth(i).click();
      await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
      
      const screenings = page.locator('[data-testid="screening-item"]');
      const screeningCount = await screenings.count();
      
      if (screeningCount > 0) {
        await screenings.first().locator('[data-testid="select-button"]').click();
      }
      
      await page.locator('[data-testid="back-button"]').click();
      await page.waitForSelector('[data-testid="film-grid"]');
    }
    
    // Verify no quota errors occurred
    const quotaErrors = consoleMessages.filter(msg => 
      msg.includes('quota') && msg.includes('exceeded')
    );
    expect(quotaErrors).toHaveLength(0);
    
    // Verify selections are still working
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(parseInt(count)).toBeGreaterThan(0);
    
    // Verify data is still accessible
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    expect(localStorageData.selections.length).toBeGreaterThan(0);
  });

  test('Data integrity after rapid operations', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Perform rapid add/remove operations
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    const screenings = page.locator('[data-testid="screening-item"]');
    const selectButton = screenings.first().locator('[data-testid="select-button"]');
    
    // Rapid selection/deselection
    for (let i = 0; i < 5; i++) {
      await selectButton.click();
      await page.waitForTimeout(100);
      
      // Navigate to schedule and back to test persistence
      await page.locator('[data-testid="schedule-tab"]').click();
      await page.waitForTimeout(100);
      await page.locator('[data-testid="films-tab"]').click();
      await page.waitForTimeout(100);
      
      // If button shows "Selected", click to deselect, otherwise select
      const buttonText = await selectButton.textContent();
      if (buttonText.includes('Selected') || buttonText.includes('已選')) {
        // Need to go to schedule to remove
        await page.locator('[data-testid="schedule-tab"]').click();
        const scheduleItems = page.locator('[data-testid="schedule-item"]');
        if (await scheduleItems.count() > 0) {
          await scheduleItems.first().locator('[data-testid="remove-button"]').click();
        }
        await page.locator('[data-testid="films-tab"]').click();
      }
    }
    
    // Final verification - data should be consistent
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('hkaff-selections') || '{}');
    });
    
    // Should have valid schema
    expect(localStorageData).toHaveProperty('version');
    expect(localStorageData).toHaveProperty('selections');
    expect(localStorageData).toHaveProperty('preferences');
    expect(Array.isArray(localStorageData.selections)).toBe(true);
    
    // Each selection should have required fields
    localStorageData.selections.forEach(selection => {
      expect(selection).toHaveProperty('screening_id');
      expect(selection).toHaveProperty('added_at');
      expect(selection).toHaveProperty('film_snapshot');
      expect(selection).toHaveProperty('screening_snapshot');
    });
  });
});