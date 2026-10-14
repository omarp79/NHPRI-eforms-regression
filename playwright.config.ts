import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* Run all tests in parallel locally to speed up execution */
  fullyParallel: true,
  
  /* Prevent pushing focused tests to production pipelines */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI to account for network flakiness, but fail instantly locally */
  retries: process.env.CI ? 2 : 0,
  
  /* Use all available CPU threads locally, scale down to 1 on slow cloud boxes */
  workers: process.env.CI ? 1 : undefined,
  
  /* Generates an interactive web report after execution finishes */
  reporter: 'html',

  /* 🛠️ FORCE BROADCASTING MODE LOCALLY */
  use: {
    headless: false,         // <-- Hardcoding 'false' guarantees a window pops up locally!
    trace: 'on-first-retry', // <-- Captures DOM/network snapshots if a regression hits
  },

  /* Active targeted testing browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Inherits headless: false
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }, // Inherits headless: false
    },
  ],
});
