import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'


test.beforeEach(async ({ page }) => {
  //I need to load load the tag enpdoint before each test
  await page.route('*/**/api/tags', async (route) => {
    await route.fulfill({
      json: tags
    })
  })
  
  await page.route('*/**/api/articles*', async (route) => {
    const response = await route.fetch();
    const responseJson = await response.json();
    responseJson.articles[0].title = 'This is a mocked title';
    responseJson.articles[0].description = 'This is a mocked description';
    await route.fulfill({
      json: responseJson
    })
  })

  await page.goto('https://conduit.bondaracademy.com/');
})

test('has the correct title', async ({ page }) => {
  await expect(page).toHaveTitle(/Conduit/);
  await expect(page.locator('.article-preview h1').first()).toContainText('This is a mocked title');
  await expect(page.locator('.article-preview p').first()).toContainText('This is a mocked description');

});