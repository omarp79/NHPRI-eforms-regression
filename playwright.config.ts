import { defineConfig, devices } from '@playwright/test'; 
import dotenv from 'dotenv'; 
declare const process: { env: Record<string, string | undefined>; }; 

dotenv.config({ path: '.env', override: true,
    quiet: true // Suppresses the runtime "injected env" confirmation message
 }); 

export default defineConfig({ 
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'html',

  fullyParallel: true, 
  forbidOnly: !!process.env.CI, 
  workers: process.env.CI ? 1 : undefined, 

  use: { 
    actionTimeout: 10000,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry', 
  }, 

  projects: [ 
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }, 
   // { name: 'firefox', use: { ...devices['Desktop Firefox'] } }, 
   // { name: 'webkit', use: { ...devices['Desktop Safari'] } }, 
  ], 
});
