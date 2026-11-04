import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { getCredentials } from './helpers/credentials';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
 //load the credentials from the environment variables
const { email, password } = getCredentials();

setup('authenticate', async ({ page }) => {

  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://conduit.bondaracademy.com/');
    await page.locator('a.nav-link').filter({ hasText: 'Sign in' }).click();
    await page.locator('input[placeholder="Email"]').fill(email);
    await page.locator('input[placeholder="Password"]').fill(password);
    await page.locator('button[type="submit"]').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('https://conduit.bondaracademy.com/');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});