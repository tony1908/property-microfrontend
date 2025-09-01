import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3001",
        trace: "on-first-retry",
        viewport: {
            width: 1280,
            height: 720,
        },
        screenshot: "only-on-failure"
    },

    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"]
            }
        },
        {
            name: "firefox",
            use: {
                ...devices["Desktop Firefox"]
            },
        },
        {
            name: "webkit",
            use: {
                ...devices["Desktop Safari"]
            },
        },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:3001",
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
    },
})
