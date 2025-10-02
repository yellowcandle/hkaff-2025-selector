/**
 * E2E Tests for Markdown Export Functionality
 * 
 * These tests validate the user journey for exporting schedule to markdown.
 * They MUST FAIL before the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('T034: Markdown Export E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="film-grid"]');
  });

  test('Export schedule to markdown format', async ({ page }) => {
    // First select some screenings
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="film-grid"]');
    
    const secondCard = page.locator('[data-testid="film-card"]').nth(1);
    await secondCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule view
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Verify schedule has selections
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    await expect(scheduleItems).toHaveCount(2);
    
    // Click export button
    const exportButton = page.locator('[data-testid="export-button"]');
    await expect(exportButton).toBeVisible();
    await exportButton.click();
    
    // Verify export modal appears
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();
    
    // Verify markdown content is displayed
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    await expect(markdownContent).toBeVisible();
    
    const markdownText = await markdownContent.textContent();
    
    // Verify markdown structure
    expect(markdownText).toContain('# My HKAFF 2025 Schedule');
    expect(markdownText).toMatch(/## \d{1,2}月\d{1,2}日/); // Date header in Chinese
    expect(markdownText).toMatch(/### \d{1,2}:\d{2}/); // Time format
    
    // Verify film titles are included
    expect(markdownText).toMatch(/[\u4e00-\u9fff]/); // Chinese characters
    
    // Verify venue information is included
    expect(markdownText).toMatch(/- \*\*Venue\*\*:/);
    
    // Verify duration information is included
    expect(markdownText).toMatch(/- \*\*Duration\*\*:/);
  });

  test('Copy markdown to clipboard', async ({ page }) => {
    // Select screenings first
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-tab"]').click();
    await page.locator('[data-testid="export-button"]').click();
    
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();
    
    // Click copy button
    const copyButton = page.locator('[data-testid="copy-button"]');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    
    // Verify success message appears
    const successMessage = page.locator('[data-testid="copy-success"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText(/copied|複製/);
    
    // Verify clipboard content (Note: clipboard access in Playwright may be limited)
    // This is more of a smoke test - actual clipboard testing might need different approach
    await page.waitForTimeout(1000);
  });

  test('Export in English language', async ({ page }) => {
    // Switch to English first
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForSelector('[data-testid="language-option"]');
    await page.locator('[data-testid="language-option"]:has-text("EN")').click();
    await page.waitForTimeout(500);
    
    // Select screenings
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-tab"]').click();
    await page.locator('[data-testid="export-button"]').click();
    
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();
    
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdownText = await markdownContent.textContent();
    
    // Verify English markdown structure
    expect(markdownText).toContain('# My HKAFF 2025 Schedule');
    expect(markdownText).toMatch(/## (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/); // English day names
    expect(markdownText).toMatch(/### \d{1,2}:\d{2}/); // Time format
    
    // Verify film titles are in English
    expect(markdownText).toMatch(/^[A-Za-z0-9\s\-\:\',\.]+$/m);
    
    // Verify English labels
    expect(markdownText).toContain('**Venue**:');
    expect(markdownText).toContain('**Duration**:');
    expect(markdownText).toContain('**Director**:');
  });

  test('Export empty schedule', async ({ page }) => {
    // Navigate to schedule without selecting anything
    await page.locator('[data-testid="schedule-tab"]').click();
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Verify empty state
    const emptySchedule = page.locator('[data-testid="empty-schedule"]');
    await expect(emptySchedule).toBeVisible();
    
    // Export button should still be available
    const exportButton = page.locator('[data-testid="export-button"]');
    await expect(exportButton).toBeVisible();
    await exportButton.click();
    
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();
    
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdownText = await markdownContent.textContent();
    
    // Should still have header but no selections
    expect(markdownText).toContain('# My HKAFF 2025 Schedule');
    expect(markdownText).toContain('No selections yet');
  });

  test('Close export modal', async ({ page }) => {
    // Select a screening first
    const firstCard = page.locator('[data-testid="film-card"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="film-detail"]')).toBeVisible();
    await page.locator('[data-testid="screening-item"]').first().locator('[data-testid="select-button"]').click();
    
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-tab"]').click();
    await page.locator('[data-testid="export-button"]').click();
    
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();
    
    // Close modal using close button
    const closeButton = page.locator('[data-testid="close-modal"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // Verify modal is closed
    await expect(exportModal).not.toBeVisible();
    
    // Verify we're back on schedule view
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
    
    // Try opening modal again to ensure it still works
    await page.locator('[data-testid="export-button"]').click();
    await expect(exportModal).toBeVisible();
  });
});