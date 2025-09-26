import { test, expect } from '@playwright/test';
import path from 'path';
import LoginPage from '../../pages/LoginPage';

test.describe('Add Member - File Upload Module', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('8978989789', 'Test@1234', 'Corporate');
    await page.waitForURL('**/vfs/branch');

    // Navigate to Members page and then to Create Member page
    await page.click("//img[@alt='arrow']");
    await page.click("//a[normalize-space()='Create Member']");
    

    await expect(page.locator('text=Click to upload the member list file OR drag & drop the file here.')).toBeVisible();
  });

  test('Valid Excel file upload', async ({ page }) => {
    const filePath = path.resolve('tests/fixtures/sample-members/valid_members.xlsx');
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.click('button:has-text("Validate")');
    await expect(page.locator("//div[contains(text(),'File is verified. Click upload to continue.')]")).toBeVisible();
    await page.click('button:has-text("Upload")');
    await expect(page.locator("//div[contains(text(),'Member data has been added successfully.')]")).toBeVisible();
  });

  test('Empty Excel file upload', async ({ page }) => {
    const filePath = path.resolve('tests/fixtures/sample-members/empty.xlsx');
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.click('button:has-text("Validate")');
    await expect(page.locator("//div[contains(text(),'There must be at least one data row in the excel f')]")).toBeVisible();
  });

  test('Excel with missing columns', async ({ page }) => {
    const filePath = path.resolve('tests/fixtures/sample-members/invalid_columns.xlsx');
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.click('button:has-text("Validate")');
    await expect(page.locator("//div[contains(text(),'Empty headers found in the file')]")).toBeVisible();
  });
});
