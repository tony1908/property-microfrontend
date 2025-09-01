import { test, expect } from '@playwright/test';

test.describe('Property Service App', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Popular Destinations');
  });

  test('should render property cards when properties are available', async ({ page }) => {
    await page.goto('/');
    
    // Wait for potential property cards to load
    await page.waitForTimeout(1000);
    
    const propertyCards = page.locator('.property-card');
    const cardCount = await propertyCards.count();
    
    if (cardCount > 0) {
      // If properties are rendered, verify structure
      await expect(propertyCards.first()).toBeVisible();
      
      // Check for property card elements
      const firstCard = propertyCards.first();
      await expect(firstCard.locator('.property-title')).toBeVisible();
      await expect(firstCard.locator('.property-image')).toBeVisible();
      await expect(firstCard.locator('.property-price')).toBeVisible();
    } else {
      // If no properties, just verify the main container exists
      await expect(page.locator('.property-grid-container')).toBeVisible();
    }
  });

  test('should have clickable property cards', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const propertyCards = page.locator('.property-card');
    const cardCount = await propertyCards.count();
    
    if (cardCount > 0) {
      const consoleLogs: string[] = [];
      
      // Listen for console logs
      page.on('console', msg => {
        if (msg.type() === 'log') {
          consoleLogs.push(msg.text());
        }
      });
      
      // Click the first property card
      await propertyCards.first().click();
      
      // Wait a bit for console log to appear
      await page.waitForTimeout(500);
      
      // Verify that clicking triggers some action (console log)
      expect(consoleLogs.length).toBeGreaterThan(0);
    }
  });

  test('should have proper responsive layout', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    await expect(page.locator('.property-grid-container')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await expect(page.locator('.property-grid-container')).toBeVisible();
  });

  test('should display property information correctly', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const propertyCards = page.locator('.property-card');
    const cardCount = await propertyCards.count();
    
    if (cardCount > 0) {
      const firstCard = propertyCards.first();
      
      // Check that essential property information is displayed
      await expect(firstCard.locator('.property-title')).toBeVisible();
      await expect(firstCard.locator('.property-type')).toBeVisible();
      await expect(firstCard.locator('.property-location')).toBeVisible();
      await expect(firstCard.locator('.property-price .price-amount')).toBeVisible();
      await expect(firstCard.locator('.property-rating .rating-value')).toBeVisible();
      
      // Verify image is loaded
      const image = firstCard.locator('.property-image');
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('src', /.+/); // Has some src value
    }
  });
});