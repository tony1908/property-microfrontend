import { test, expect } from '@playwright/test';

test.describe('Performance Monitoring', () => {
  test('should track web vitals metrics on page load', async ({ page }) => {
    const webVitalsLogs: string[] = [];
    
    // Capture web vitals console logs
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Web Vital:')) {
        webVitalsLogs.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait for page to load and metrics to be collected
    await page.waitForTimeout(3000);
    
    // Verify that some web vitals metrics were logged
    expect(webVitalsLogs.length).toBeGreaterThan(0);
    
    // Check that we have at least some common metrics
    const hasWebVitalLog = webVitalsLogs.some(log => 
      log.includes('FCP') || log.includes('LCP') || log.includes('TTFB')
    );
    expect(hasWebVitalLog).toBe(true);
  });

  test('should show performance monitor when keyboard shortcut is pressed', async ({ page }) => {
    await page.goto('/');
    
    // Initially, performance monitor should not be visible
    await expect(page.locator('.performance-monitor')).not.toBeVisible();
    
    // Press Ctrl+Shift+P to show performance monitor
    await page.keyboard.press('Control+Shift+KeyP');
    
    // Wait for performance monitor to appear
    await expect(page.locator('.performance-monitor')).toBeVisible({ timeout: 10000 });
    
    // Check that performance header is visible
    await expect(page.locator('.performance-header h3')).toContainText('Performance Metrics');
    
    // Check that overall score is displayed
    await expect(page.locator('.overall-score')).toBeVisible();
  });

  test('should display performance metrics in the monitor', async ({ page }) => {
    await page.goto('/');
    
    // Show performance monitor
    await page.keyboard.press('Control+Shift+KeyP');
    await expect(page.locator('.performance-monitor')).toBeVisible({ timeout: 10000 });
    
    // Wait for metrics to be collected
    await page.waitForTimeout(3000);
    
    // Check that metric items are present
    const metricItems = page.locator('.metric-item');
    const count = await metricItems.count();
    expect(count).toBeGreaterThanOrEqual(3); // Should have at least FCP, LCP, TTFB
    
    // Check that CLS metric is present (if available)
    const clsMetric = page.locator('.metric-item').filter({ hasText: 'CLS' });
    if (await clsMetric.count() > 0) {
      await expect(clsMetric.locator('value')).toBeVisible();
    }
  });

  test('should track component render performance', async ({ page }) => {
    const performanceLogs: string[] = [];
    
    // Capture component performance logs
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('render time:')) {
        performanceLogs.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait for components to render and logs to be captured
    await page.waitForTimeout(2000);
    
    // Verify that component performance is being tracked
    const hasPropertyCardLog = performanceLogs.some(log => 
      log.includes('PropertyCard render time:')
    );
    expect(hasPropertyCardLog).toBe(true);
  });

  test('should handle performance metrics collection gracefully', async ({ page }) => {
    const errorLogs: string[] = [];
    
    // Capture any error logs
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Show performance monitor
    await page.keyboard.press('Control+Shift+KeyP');
    await expect(page.locator('.performance-monitor')).toBeVisible({ timeout: 10000 });
    
    // Wait for metrics collection
    await page.waitForTimeout(5000);
    
    // Verify no critical errors occurred during metrics collection
    const hasCriticalErrors = errorLogs.some(log => 
      log.includes('web-vitals') || log.includes('performance')
    );
    expect(hasCriticalErrors).toBe(false);
  });

  test('should show keyboard shortcut hint when performance monitor is hidden', async ({ page }) => {
    await page.goto('/');
    
    // Check that the keyboard shortcut hint is visible initially
    await expect(page.locator('text=Press Ctrl+Shift+P to show performance metrics')).toBeVisible();
    
    // Show performance monitor
    await page.keyboard.press('Control+Shift+KeyP');
    
    // Check that the hint is hidden when monitor is visible
    await expect(page.locator('text=Press Ctrl+Shift+P to show performance metrics')).not.toBeVisible();
    
    // Hide performance monitor
    await page.keyboard.press('Control+Shift+KeyP');
    
    // Check that the hint is visible again
    await expect(page.locator('text=Press Ctrl+Shift+P to show performance metrics')).toBeVisible();
  });
});