/**
 * E2E Tests for Film Browsing Functionality
 * 
 * These tests validate the user journey for browsing the film catalogue.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T027-T028: Film Browsing E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app - this will fail until app is implemented
    await page.goto('http://localhost:5173');
  });

  test('T027: Browse film catalogue', async ({ page }) => {
    // Test that film catalogue displays in grid layout
    await expect(page.locator('[data-testid="film-grid"]')).toBeVisible();
    
    // Check that films are displayed (should have multiple film cards)
    const filmCards = page.locator('[data-testid="film-card"]');
    await expect(filmCards.first()).toBeVisible();
    const cardCount = await filmCards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Verify each film shows required elements
    const firstCard = filmCards.first();
    await expect(firstCard.locator('[data-testid="film-poster"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="film-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="film-category"]')).toBeVisible();
    
    // Verify text is in Traditional Chinese by default
    const title = await firstCard.locator('[data-testid="film-title"]').textContent();
    expect(title).toMatch(/[\u4e00-\u9fff]/); // Contains Chinese characters
  });

  test('T028: Filter by category/venue', async ({ page }) => {
    // Wait for film catalogue to load
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Get initial film count
    const allFilms = page.locator('[data-testid="film-card"]');
    const initialCount = await allFilms.count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Find category dropdown
    const categoryDropdown = page.locator('[data-testid="category-filter"]');
    await expect(categoryDropdown).toBeVisible();
    
    // Click category dropdown
    await categoryDropdown.click();
    
    // Wait for dropdown options to appear
    await page.waitForSelector('[data-testid="category-option"]');
    
    // Select "Opening Film" category (開幕電影)
    const openingFilmOption = page.locator('[data-testid="category-option"]:has-text("開幕電影")');
    await expect(openingFilmOption).toBeVisible();
    await openingFilmOption.click();
    
    // Verify film list is filtered
    await page.waitForTimeout(500); // Wait for filter to apply
    const filteredFilms = page.locator('[data-testid="film-card"]');
    const filteredCount = await filteredFilms.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Test venue filtering
    const venueDropdown = page.locator('[data-testid="venue-filter"]');
    await expect(venueDropdown).toBeVisible();
    await venueDropdown.click();
    
    await page.waitForSelector('[data-testid="venue-option"]');
    const broadwayOption = page.locator('[data-testid="venue-option"]:has-text("百老匯電影中心")');
    await expect(broadwayOption).toBeVisible();
    await broadwayOption.click();
    
    // Verify both filters work together
    await page.waitForTimeout(500);
    const doubleFilteredFilms = page.locator('[data-testid="film-card"]');
    const doubleFilteredCount = await doubleFilteredFilms.count();
    expect(doubleFilteredCount).toBeLessThanOrEqual(filteredCount);
  });

  test('Film cards are clickable and show details', async ({ page }) => {
    // Wait for films to load
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Click on first film card
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    
    // Should show film detail modal/page
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    
    // Verify film details are displayed
    await expect(page.locator('[data-testid="film-detail-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="film-detail-synopsis"]')).toBeVisible();
    await expect(page.locator('[data-testid="film-detail-director"]')).toBeVisible();
    await expect(page.locator('[data-testid="film-detail-runtime"]')).toBeVisible();
    await expect(page.locator('[data-testid="film-detail-country"]')).toBeVisible();
    
    // Verify screenings are listed
    await expect(page.locator('[data-testid="screening-list"]')).toBeVisible();
    const screenings = page.locator('[data-testid="screening-item"]');
    const screeningCount = await screenings.count();
    expect(screeningCount).toBeGreaterThan(0);
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for films to load
    await page.waitForSelector('[data-testid="film-grid"]');
    
    // Check grid layout adapts to mobile (should be 1 column)
    const filmGrid = page.locator('[data-testid="film-grid"]');
    await expect(filmGrid).toHaveCSS('grid-template-columns', '1fr');
    
    // Check filter panel stacks vertically on mobile
    const filterPanel = page.locator('[data-testid="filter-panel"]');
    await expect(filterPanel).toBeVisible();
    
    // Verify touch targets are large enough (>=44x44px)
    const firstCard = page.locator('[data-testid="film-card"]').first();
    const box = await firstCard.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});