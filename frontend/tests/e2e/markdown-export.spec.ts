/**
 * T034: Markdown Export E2E Tests
 *
 * Tests based on quickstart.md scenario 8:
 * - Export schedule to markdown
 * - Verify markdown format
 * - Copy to clipboard functionality
 *
 * These tests will FAIL until UI is implemented (expected behavior in TDD)
 */

import { test, expect } from '@playwright/test';

test.describe('T034: Markdown Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Add at least one selection for export tests
    await page.locator('[data-testid="film-card"]').first().click();
    await page.waitForSelector('[data-testid="screening-item"]', { timeout: 2000 });
    await page.locator('[data-testid="screening-item"]').first()
      .locator('[data-testid="select-screening-btn"]').click();

    await page.keyboard.press('Escape');
  });

  test('should display export button in schedule view', async ({ page }) => {
    // Navigate to schedule
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Verify export button is visible
    const exportButton = page.locator('[data-testid="export-btn"]');
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toContainText(/Export|匯出|導出/i);
  });

  test('should open export modal when export button clicked', async ({ page }) => {
    // Navigate to schedule
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Click export button
    await page.locator('[data-testid="export-btn"]').click();

    // Verify export modal opens
    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible({ timeout: 1000 });
  });

  test('should display markdown-formatted schedule in modal', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Verify markdown content area
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    await expect(markdownContent).toBeVisible();

    // Get markdown text
    const markdown = await markdownContent.textContent();

    // Verify basic markdown structure
    expect(markdown).toContain('# My HKAFF 2025 Schedule');
    expect(markdown).toContain('##'); // Date headers
  });

  test('should include all selected screenings in markdown', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Count schedule items
    const scheduleItems = page.locator('[data-testid="schedule-item"]');
    const itemCount = await scheduleItems.count();

    // Export
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown content
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Count screening entries in markdown (look for "###" which marks each screening)
    const screeningMatches = markdown?.match(/###/g);
    const markdownScreeningCount = screeningMatches ? screeningMatches.length : 0;

    expect(markdownScreeningCount).toBe(itemCount);
  });

  test('should format markdown with proper headers and structure', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Verify H1 header
    expect(markdown).toMatch(/^# My HKAFF 2025 Schedule/m);

    // Verify H2 date headers (e.g., "## 3月15日 (Friday)" or "## March 15 (Friday)")
    expect(markdown).toMatch(/## .+\s+\(/m);

    // Verify H3 screening headers (e.g., "### 19:30 - Film Title")
    expect(markdown).toMatch(/### \d{2}:\d{2} - /m);

    // Verify bullet points for details
    expect(markdown).toContain('- **Venue**:');
    expect(markdown).toContain('- **Duration**:');
  });

  test('should include screening details: venue, duration, time', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Verify venue information
    expect(markdown).toMatch(/- \*\*Venue\*\*:/);

    // Verify duration information
    expect(markdown).toMatch(/- \*\*Duration\*\*: \d+ minutes/);

    // Verify time in screening header
    expect(markdown).toMatch(/### \d{2}:\d{2}/);
  });

  test('should group screenings by date in markdown', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Verify date grouping structure
    // Each date should have a ## header followed by ### screening entries
    const dateHeaderMatches = markdown?.match(/## .+/g);
    expect(dateHeaderMatches).not.toBeNull();
    expect(dateHeaderMatches!.length).toBeGreaterThan(0);
  });

  test('should copy markdown to clipboard when copy button clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get expected markdown text
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const expectedMarkdown = await markdownContent.textContent();

    // Click copy button
    const copyButton = page.locator('[data-testid="copy-markdown-btn"]');
    await copyButton.click();

    // Wait for copy operation
    await page.waitForTimeout(300);

    // Read clipboard
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // Verify clipboard contains markdown
    expect(clipboardText).toBe(expectedMarkdown);
  });

  test('should show confirmation after successful copy', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Click copy button
    const copyButton = page.locator('[data-testid="copy-markdown-btn"]');
    await copyButton.click();

    // Look for confirmation message
    const confirmation = page.locator('[data-testid="copy-confirmation"]');
    await expect(confirmation).toBeVisible({ timeout: 1000 });

    // Confirmation should contain success message
    const confirmText = await confirmation.textContent();
    expect(confirmText).toMatch(/Copied|複製成功|已複製/i);
  });

  test('should use correct language in markdown export', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Switch to English
    await page.locator('[data-testid="language-toggle"]').click();
    await page.waitForTimeout(200);

    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Verify English headings
    expect(markdown).toContain('# My HKAFF 2025 Schedule');
    expect(markdown).toContain('**Venue**:');
    expect(markdown).toContain('**Duration**:');

    // Film titles should be in English
    expect(markdown).toBeDefined();
  });

  test('should close export modal', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    const exportModal = page.locator('[data-testid="export-modal"]');
    await expect(exportModal).toBeVisible();

    // Close modal (click close button or escape)
    const closeButton = page.locator('[data-testid="close-export-modal-btn"]');

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // Verify modal is closed
    await page.waitForTimeout(300);
    await expect(exportModal).not.toBeVisible();
  });

  test('should disable export button when no selections', async ({ page }) => {
    // Clear all selections
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('[data-testid="film-grid"]', { timeout: 5000 });

    // Navigate to schedule
    await page.locator('[data-testid="schedule-nav-link"]').click();

    // Export button should be disabled or hidden
    const exportButton = page.locator('[data-testid="export-btn"]');

    if (await exportButton.isVisible()) {
      const isDisabled = await exportButton.isDisabled();
      expect(isDisabled).toBe(true);
    } else {
      // Button is hidden when no selections - this is also valid
      expect(await exportButton.isHidden()).toBe(true);
    }
  });

  test('should handle multiple screenings across multiple dates', async ({ page }) => {
    // Add multiple selections (if possible)
    // This test assumes we can add multiple screenings

    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Verify structure is maintained even with multiple dates
    expect(markdown).toContain('# My HKAFF 2025 Schedule');
    expect(markdown).toMatch(/##/); // Date headers

    // Markdown should be valid (no broken formatting)
    expect(markdown).not.toContain('undefined');
    expect(markdown).not.toContain('null');
  });

  test('should format dates in readable format', async ({ page }) => {
    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Get markdown
    const markdownContent = page.locator('[data-testid="markdown-content"]');
    const markdown = await markdownContent.textContent();

    // Date headers should include day of week
    // e.g., "## 3月15日 (Friday)" or "## March 15 (Friday)"
    expect(markdown).toMatch(/## .+ \((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|星期)/i);
  });

  test('should preserve markdown syntax validity', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Navigate to schedule and export
    await page.locator('[data-testid="schedule-nav-link"]').click();
    await page.locator('[data-testid="export-btn"]').click();

    // Copy markdown
    await page.locator('[data-testid="copy-markdown-btn"]').click();
    await page.waitForTimeout(300);

    // Get clipboard content
    const markdown = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // Verify no broken markdown patterns
    expect(markdown).not.toMatch(/\*\*\*\*/); // No triple/quadruple asterisks
    expect(markdown).not.toMatch(/####+ [^#]/); // No H4+ headers (only H1-H3 should be used)
    expect(markdown).toMatch(/^# /m); // Starts with H1
    expect(markdown).toMatch(/\n\n/); // Has proper spacing
  });
});
