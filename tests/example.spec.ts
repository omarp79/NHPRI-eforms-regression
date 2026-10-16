import { test, expect } from '@playwright/test';

import { BuildURLHelper } from '../pages/buildURL';
const buildURLHelper = new BuildURLHelper();

test('has title', async ({ page }) => {
 // await page.goto('https://playwright.dev/');

  const domainURL = await buildURLHelper.getDomainURL('qa');
  console.log(` [INFO]: Navigating to domain URL: ${domainURL}`);
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
