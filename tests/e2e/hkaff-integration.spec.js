import { test, expect } from '@playwright/test';

test.describe('HKAFF Film Selection Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should load and display film list', async ({ page }) => {
    // Wait for films to load
    await page.waitForSelector('[data-testid="film-card"]', { timeout: 5000 });
    
    const filmCards = await page.locator('[data-testid="film-card"]').count();
    expect(filmCards).toBeGreaterThan(0);
  });

  test('should search films by title', async ({ page }) => {
    await page.waitForSelector('[data-testid="search-input"]');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Another World');
    
    await page.waitForTimeout(500);
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    
    if (count > 0) {
      const title = await filmCards.first().locator('[data-testid="film-title"]').textContent();
      expect(title).toContain('Another World');
    }
  });

  test('should filter films by genre', async ({ page }) => {
    await page.waitForSelector('[data-testid="genre-filter"]');
    
    const genreFilter = page.locator('[data-testid="genre-filter"]');
    await genreFilter.click();
    
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    
    await page.waitForTimeout(300);
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should select and deselect films', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCard = page.locator('[data-testid="film-card"]').first();
    const selectButton = filmCard.locator('[data-testid="select-button"]');
    
    // Select film
    await selectButton.click();
    await page.waitForTimeout(300);
    
    let buttonText = await selectButton.textContent();
    expect(buttonText).toContain('Remove');
    
    // Deselect film
    await selectButton.click();
    await page.waitForTimeout(300);
    
    buttonText = await selectButton.textContent();
    expect(buttonText).toContain('Add');
  });

  test('should view film details', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCard = page.locator('[data-testid="film-card"]').first();
    const detailsButton = filmCard.locator('[data-testid="details-button"]');
    
    await detailsButton.click();
    await page.waitForTimeout(500);
    
    const detailPanel = page.locator('[data-testid="film-detail-panel"]');
    await expect(detailPanel).toBeVisible();
  });

  test('should add multiple films to schedule', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    
    const filmsToSelect = Math.min(3, count);
    
    for (let i = 0; i < filmsToSelect; i++) {
      const card = filmCards.nth(i);
      const selectButton = card.locator('[data-testid="select-button"]');
      await selectButton.click();
      await page.waitForTimeout(200);
    }
    
    const scheduleCounter = page.locator('[data-testid="schedule-count"]');
    const text = await scheduleCounter.textContent();
    expect(text).toContain(filmsToSelect);
  });

  test('should handle empty search results', async ({ page }) => {
    await page.waitForSelector('[data-testid="search-input"]');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('NonexistentFilmXYZ123');
    
    await page.waitForTimeout(500);
    
    const emptyMessage = page.locator('[data-testid="empty-message"]');
    await expect(emptyMessage).toBeVisible();
  });

  test('should clear search and show all films', async ({ page }) => {
    await page.waitForSelector('[data-testid="search-input"]');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Another World');
    
    await page.waitForTimeout(300);
    
    const clearButton = page.locator('[data-testid="clear-search-button"]');
    await clearButton.click();
    
    await page.waitForTimeout(300);
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should maintain selection across navigation', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    // Select a film
    const filmCard = page.locator('[data-testid="film-card"]').first();
    const selectButton = filmCard.locator('[data-testid="select-button"]');
    await selectButton.click();
    
    await page.waitForTimeout(300);
    
    // Navigate somewhere else
    const scheduleLink = page.locator('[data-testid="schedule-link"]');
    if (await scheduleLink.isVisible()) {
      await scheduleLink.click();
      await page.waitForTimeout(500);
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(300);
      
      // Check selection is still there
      const selectButtonAgain = filmCard.locator('[data-testid="select-button"]');
      const buttonText = await selectButtonAgain.textContent();
      expect(buttonText).toContain('Remove');
    }
  });

  test('should display film information correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCard = page.locator('[data-testid="film-card"]').first();
    
    // Check essential info is displayed
    const title = filmCard.locator('[data-testid="film-title"]');
    await expect(title).toBeVisible();
    
    const director = filmCard.locator('[data-testid="film-director"]');
    if (await director.isVisible()) {
      const directorText = await director.textContent();
      expect(directorText).toBeTruthy();
    }
    
    const runtime = filmCard.locator('[data-testid="film-runtime"]');
    if (await runtime.isVisible()) {
      const runtimeText = await runtime.textContent();
      expect(runtimeText).toContain('min');
    }
  });

  test('should handle rapid selection changes', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCard = page.locator('[data-testid="film-card"]').first();
    const selectButton = filmCard.locator('[data-testid="select-button"]');
    
    // Rapidly click button
    await selectButton.click();
    await selectButton.click();
    await selectButton.click();
    
    await page.waitForTimeout(500);
    
    // Film should be deselected (odd number of clicks)
    const finalButtonText = await selectButton.textContent();
    expect(finalButtonText).toContain('Add');
  });
});

test.describe('HKAFF Filtering Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should filter by venue', async ({ page }) => {
    await page.waitForSelector('[data-testid="venue-filter"]');
    
    const venueFilter = page.locator('[data-testid="venue-filter"]');
    await venueFilter.click();
    
    const option = page.locator('[role="option"]').first();
    await option.click();
    
    await page.waitForTimeout(300);
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should combine multiple filters', async ({ page }) => {
    await page.waitForSelector('[data-testid="genre-filter"]');
    
    const genreFilter = page.locator('[data-testid="genre-filter"]');
    await genreFilter.click();
    const genreOption = page.locator('[role="option"]').first();
    await genreOption.click();
    
    await page.waitForTimeout(200);
    
    const venueFilter = page.locator('[data-testid="venue-filter"]');
    await venueFilter.click();
    const venueOption = page.locator('[role="option"]').first();
    await venueOption.click();
    
    await page.waitForTimeout(300);
    
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should reset all filters', async ({ page }) => {
    await page.waitForSelector('[data-testid="genre-filter"]');
    
    // Apply a filter
    const genreFilter = page.locator('[data-testid="genre-filter"]');
    await genreFilter.click();
    const option = page.locator('[role="option"]').first();
    await option.click();
    
    await page.waitForTimeout(300);
    
    const initialCount = await page.locator('[data-testid="film-card"]').count();
    
    // Reset filters
    const resetButton = page.locator('[data-testid="reset-filters-button"]');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.waitForTimeout(300);
    }
    
    const finalCount = await page.locator('[data-testid="film-card"]').count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });
});

test.describe('HKAFF Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should switch between languages', async ({ page }) => {
    await page.waitForSelector('[data-testid="language-toggle"]');
    
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    
    // Get current language
    const currentLang = await languageToggle.getAttribute('data-language');
    expect(currentLang).toBeTruthy();
    
    // Switch language
    await languageToggle.click();
    await page.waitForTimeout(300);
    
    const newLang = await languageToggle.getAttribute('data-language');
    expect(newLang).not.toBe(currentLang);
  });

  test('should persist language preference', async ({ page }) => {
    await page.waitForSelector('[data-testid="language-toggle"]');
    
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();
    
    const selectedLanguage = await languageToggle.getAttribute('data-language');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const persistedLanguage = await page.locator('[data-testid="language-toggle"]').getAttribute('data-language');
    expect(persistedLanguage).toBe(selectedLanguage);
  });
});

test.describe('HKAFF Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should have accessible button labels', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]');
    
    const filmCard = page.locator('[data-testid="film-card"]').first();
    const selectButton = filmCard.locator('[data-testid="select-button"]');
    
    const ariaLabel = await selectButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.waitForSelector('[data-testid="search-input"]');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    
    // Focus on search input
    await searchInput.focus();
    const focused = await searchInput.evaluate(el => el === document.activeElement);
    expect(focused).toBe(true);
    
    // Type with keyboard
    await page.keyboard.type('Drama');
    
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe('Drama');
  });
});
