import { test, expect } from "@playwright/test";

test.describe("Property App", () => {
    
    test("should render the property app", async ({ page }) => {
        await page.goto("/")
        await expect(page.locator("h1")).toHaveText("Popular Destinations");
    })

    test("should render the property cards when properties are passed", async ({ page }) => {
        await page.goto("/")
        await page.waitForTimeout(1000);

        const propertyCards = page.locator(".property-card")
        const cardCount = await propertyCards.count()

        expect(cardCount).toBe(1);
    })

})
        
    