/**
 * E2E Visual Regression Tests for Homepage
 *
 * These tests validate that the homepage matches the Figma mockup.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T006: Homepage Visual Regression Tests', () => {
  test('Homepage matches Figma mockup - desktop', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);

    // Take a screenshot of the entire page
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      threshold: 0.1, // Allow for small differences (10% pixel difference tolerance)
    });
  });

  test('Homepage matches Figma mockup - mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);

    // Take a screenshot of the entire page
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.1, // Allow for small differences (10% pixel difference tolerance)
    });
  });

  test('Homepage matches Figma mockup - tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);

    // Take a screenshot of the entire page
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.1, // Allow for small differences (10% pixel difference tolerance)
    });
  });

  test('Key UI elements are present and positioned correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Verify main layout elements are present
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="film-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="schedule-counter"]')).toBeVisible();

    // Verify header contains expected elements
    const header = page.locator('[data-testid="app-header"]');
    await expect(header.locator('[data-testid="app-title"]')).toBeVisible();
    await expect(header.locator('[data-testid="language-toggle"]')).toBeVisible();

    // Verify filter panel contains expected elements
    const filterPanel = page.locator('[data-testid="filter-panel"]');
    await expect(filterPanel.locator('[data-testid="category-filter"]')).toBeVisible();
    await expect(filterPanel.locator('[data-testid="venue-filter"]')).toBeVisible();

    // Verify film grid layout
    const filmGrid = page.locator('[data-testid="film-grid"]');
    const filmCards = filmGrid.locator('[data-testid="film-card"]');
    await expect(filmCards.first()).toBeVisible();

    // Verify each film card has required elements
    const firstCard = filmCards.first();
    await expect(firstCard.locator('[data-testid="film-poster"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="film-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="film-category"]')).toBeVisible();

    // Verify navigation tabs are present
    await expect(page.locator('[data-testid="films-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="schedule-tab"]')).toBeVisible();

    // Verify schedule counter shows 0 initially
    const scheduleCounter = page.locator('[data-testid="schedule-counter"]');
    const count = await scheduleCounter.textContent();
    expect(count).toBe('0');
  });

  test('Color scheme matches design specifications', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Check primary colors are applied correctly
    const header = page.locator('[data-testid="app-header"]');
    await expect(header).toHaveCSS('background-color', 'rgb(31, 41, 55)'); // gray-800

    // Check film cards have proper styling
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await expect(firstCard).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // white
    await expect(firstCard).toHaveCSS('border-radius', '8px');
    await expect(firstCard).toHaveCSS('box-shadow', /rgba\(0, 0, 0, 0\.1\)/);

    // Check buttons have proper styling
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toHaveCSS('background-color', 'rgb(59, 130, 246)'); // blue-500
    await expect(languageToggle).toHaveCSS('color', 'rgb(255, 255, 255)'); // white
  });

  test('Typography matches design specifications', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="film-grid"]');

    // Check app title typography
    const appTitle = page.locator('[data-testid="app-title"]');
    await expect(appTitle).toHaveCSS('font-size', '24px');
    await expect(appTitle).toHaveCSS('font-weight', '700'); // bold
    await expect(appTitle).toHaveCSS('color', 'rgb(255, 255, 255)'); // white

    // Check film title typography
    const filmTitle = page.locator('[data-testid="film-card"]').first().locator('[data-testid="film-title"]');
    await expect(filmTitle).toHaveCSS('font-size', '16px');
    await expect(filmTitle).toHaveCSS('font-weight', '600'); // semibold

    // Check category text typography
    const filmCategory = page.locator('[data-testid="film-card"]').first().locator('[data-testid="film-category"]');
    await expect(filmCategory).toHaveCSS('font-size', '14px');
    await expect(filmCategory).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
  });

  test('Responsive breakpoints work correctly', async ({ page }) => {
    // Test desktop layout (default)
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');

    // On desktop, film grid should be multi-column
    const filmGrid = page.locator('[data-testid="film-grid"]');
    const gridStyle = await filmGrid.getAttribute('style');
    expect(gridStyle).toMatch(/grid-template-columns:\s*repeat\(3,\s*1fr\)/); // 3 columns on desktop

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]');

    const tabletGridStyle = await filmGrid.getAttribute('style');
    expect(tabletGridStyle).toMatch(/grid-template-columns:\s*repeat\(2,\s*1fr\)/); // 2 columns on tablet

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]');

    const mobileGridStyle = await filmGrid.getAttribute('style');
    expect(mobileGridStyle).toMatch(/grid-template-columns:\s*1fr/); // 1 column on mobile
  });
});