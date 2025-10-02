/**
 * T027 & T028: Film Browsing and Filtering E2E Tests
 *
 * Tests based on quickstart.md validation scenarios:
 * - Browse film catalogue (scenario 1)
 * - Filter by category (scenario 2)
 * - Filter by venue (scenario 3)
 *
 * These tests will FAIL until UI is implemented (expected behavior in TDD)
 */

import { test, expect } from '@playwright/test';

test.describe('T027: Film Catalogue Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display film catalogue in grid layout', async ({ page }) => {
    // Wait for films to load
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Verify grid displays
    const filmGrid = page.locator('[data-testid="film-grid"]');
    await expect(filmGrid).toBeVisible();

    // Verify films are present (80-100 films expected)
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display film cards with poster, title, and category', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]', { timeout: 5000 });

    // Check first film card structure
    const firstFilm = page.locator('[data-testid="film-card"]').first();

    // Verify poster
    const poster = firstFilm.locator('[data-testid="film-poster"]');
    await expect(poster).toBeVisible();

    // Verify title
    const title = firstFilm.locator('[data-testid="film-title"]');
    await expect(title).toBeVisible();

    // Verify category label
    const category = firstFilm.locator('[data-testid="film-category"]');
    await expect(category).toBeVisible();
  });

  test('should display text in Traditional Chinese by default', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-card"]', { timeout: 5000 });

    // Check language indicator or HTML lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toMatch(/zh|zh-HK|zh-TW/);
  });

  test('should be responsive: 1 col mobile, 2-3 col desktop', async ({ page }) => {
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
    const filmGrid = page.locator('[data-testid="film-grid"]');

    // Test mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100); // Wait for layout adjustment

    // Get grid columns (check CSS or computed style)
    const mobileGridCols = await filmGrid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Test desktop viewport (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(100);

    const desktopGridCols = await filmGrid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Verify they're different (mobile should have fewer columns)
    expect(mobileGridCols).not.toBe(desktopGridCols);
  });

  test('should load data files successfully', async ({ page }) => {
    // Monitor network requests
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/data/')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for all data requests

    // Verify critical data files loaded
    const filmsResponse = responses.find(r => r.url.includes('films.json'));
    const categoriesResponse = responses.find(r => r.url.includes('categories.json'));

    expect(filmsResponse?.status).toBe(200);
    expect(categoriesResponse?.status).toBe(200);
  });

  test('should have no console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Allow warnings but no errors
    expect(consoleErrors).toHaveLength(0);
  });
});

test.describe('T028: Film Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });
  });

  test('should filter films by category', async ({ page }) => {
    // Open category dropdown
    const categoryDropdown = page.locator('[data-testid="category-filter"]');
    await expect(categoryDropdown).toBeVisible();
    await categoryDropdown.click();

    // Verify all 15 categories are shown
    const categoryOptions = page.locator('[data-testid="category-option"]');
    const categoryCount = await categoryOptions.count();
    expect(categoryCount).toBeGreaterThanOrEqual(15);

    // Select "開幕電影" (Opening Film)
    const openingFilmOption = page.locator('[data-testid="category-option"]', {
      hasText: '開幕電影'
    });
    await openingFilmOption.click();

    // Verify films are filtered (should update within 500ms)
    await page.waitForTimeout(500);

    // Check that displayed films have the selected category
    const filteredFilms = page.locator('[data-testid="film-card"]');
    const count = await filteredFilms.count();
    expect(count).toBeGreaterThan(0);

    // Verify category label on visible films
    const firstFilmCategory = filteredFilms.first().locator('[data-testid="film-category"]');
    await expect(firstFilmCategory).toContainText('開幕電影');
  });

  test('should filter films by venue', async ({ page }) => {
    // Open venue dropdown
    const venueDropdown = page.locator('[data-testid="venue-filter"]');
    await expect(venueDropdown).toBeVisible();
    await venueDropdown.click();

    // Verify all 8 venues are shown
    const venueOptions = page.locator('[data-testid="venue-option"]');
    const venueCount = await venueOptions.count();
    expect(venueCount).toBeGreaterThanOrEqual(8);

    // Select "百老匯電影中心" (Broadway Cinematheque)
    const broadwayOption = page.locator('[data-testid="venue-option"]', {
      hasText: '百老匯電影中心'
    });
    await broadwayOption.click();

    // Verify films are filtered
    await page.waitForTimeout(500);

    const filteredFilms = page.locator('[data-testid="film-card"]');
    const count = await filteredFilms.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support combined category and venue filters', async ({ page }) => {
    // Apply category filter
    await page.locator('[data-testid="category-filter"]').click();
    await page.locator('[data-testid="category-option"]').first().click();
    await page.waitForTimeout(300);

    const afterCategoryCount = await page.locator('[data-testid="film-card"]').count();

    // Apply venue filter
    await page.locator('[data-testid="venue-filter"]').click();
    await page.locator('[data-testid="venue-option"]').first().click();
    await page.waitForTimeout(300);

    const afterBothFiltersCount = await page.locator('[data-testid="film-card"]').count();

    // Combined filter should show fewer or equal films
    expect(afterBothFiltersCount).toBeLessThanOrEqual(afterCategoryCount);
  });

  test('should update filter results quickly (<500ms)', async ({ page }) => {
    const startTime = Date.now();

    // Apply filter
    await page.locator('[data-testid="category-filter"]').click();
    await page.locator('[data-testid="category-option"]').first().click();

    // Wait for UI update
    await page.waitForSelector('[data-testid="film-card"]', { timeout: 500 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within 500ms
    expect(duration).toBeLessThan(500);
  });

  test('should clear filters and show all films', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="film-card"]').count();

    // Apply filter
    await page.locator('[data-testid="category-filter"]').click();
    await page.locator('[data-testid="category-option"]').first().click();
    await page.waitForTimeout(300);

    const filteredCount = await page.locator('[data-testid="film-card"]').count();

    // Clear filters (look for clear button or reset)
    const clearButton = page.locator('[data-testid="clear-filters"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(300);

      const afterClearCount = await page.locator('[data-testid="film-card"]').count();
      expect(afterClearCount).toBe(initialCount);
    }
  });
});
