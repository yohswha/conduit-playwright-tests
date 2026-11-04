import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'
import { getAuthToken } from './helpers/auth';


//TEST CASES
//this test mocks the response of the tags endpoint and the articles endpoint
test('has the correct title', async ({ page }) => {
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
  await expect(page).toHaveTitle(/Conduit/);
  await expect(page.locator('.article-preview h1').first()).toContainText('This is a mocked title');
  await expect(page.locator('.article-preview p').first()).toContainText('This is a mocked description');

});

//this test creates an article and deletes it to keep the test environment clean, it does not use api resquest for deleting the article, it uses the UI to delete the article
test.skip('Delete an article', async ({ page, request }) => {
    const token = await getAuthToken();

    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        headers: {
            'Authorization': `Token ${token}`
        },
        data: {
            "article": {
                "title": "this is another article from Playwright",
                "description": "article created in postman",
                "body": "testing the functionality",
                "tagList": []
            }
        }

    });

    expect(newArticleResponse.status()).toEqual(201)

    await expect(page.locator('.preview-link h1').first()).toContainText('this is another article from Playwright')
    await page.getByText('this is another article from Playwright').click();
    await page.locator('button').filter({ hasText: 'Delete Article' }).first().click();
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    await expect(page.locator('.preview-link h1').first()).not.toContainText('this is another article from Playwright')
})

//this test creates an article and deletes it to keep the test environment clean
test('Create an article and delete it to keep the test environment clean', async ({ page, request }) => {
   
   const token = await getAuthToken();


    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        headers: {
            'Authorization': `Token ${token}`
        },
        data: {
            "article": {
                "title": "this is another article from Playwright",
                "description": "article created in postman",
                "body": "testing the functionality",
                "tagList": []
            }
        }

    });
    expect(newArticleResponse.status()).toEqual(201)
    const createdArticleResponseJson = await newArticleResponse.json()
    const articleSlug = createdArticleResponseJson.article.slug

    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    });
    expect(deleteArticleResponse.status()).toEqual(204)

})