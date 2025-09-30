import { test, expect } from '@playwright/test';
import path from 'path';
import LoginPage from '../../pages/LoginPage';
import ExcelJS from 'exceljs';

test.describe('HR- Add Member - File Upload Module', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log('Logging in...');
    await loginPage.login('4242425656', 'Test@1234', 'HR');
    console.log('Waiting for URL to be **/HR-page');
    await page.waitForURL('https://staging.corporate.welcomecure.com/hr/uploademployee');
    console.log('URL matched.');
    await page.waitForLoadState('networkidle');

    // Navigate to Member List page
    await page.getByRole('link', { name: 'Member List' }).click();
    await page.waitForURL('https://staging.corporate.welcomecure.com/hr/employee');
  });

  /*test('Verify Email action button opens action menu', async ({ page }) => {
    const actionBtn = page.locator("//tbody/tr[1]/td[5]/div[1]/div[1]/span[1]//*[name()='svg']");
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();
    await page.waitForTimeout(3000);
    //await expect(page.locator('body')).toContainText('Email');
  });*/

  /*test('Verify Delete action button is clickable', async ({ page }) => {
    const actionBtn = page.locator("(//*[name()='svg'][contains(@stroke,'currentColor')])[7]");
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();
    await page.waitForTimeout(3000);
  });*/

  test('HR- Add Family member - successful addition', async ({ page }) => {
    const timestamp = Date.now().toString().slice(-5);

    // Click the button to open the add family member form
    await page.locator('.flex.justify-center.bg-\\[\\#FCDD00\\].cursor-pointer').first().click();

    // Fill out the new member form
    const newMemberName = `TestMember_${timestamp}`;
    const newEmail = `test_${timestamp}@example.com`;
    const newContact = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    const age = '30'; // Example age

    // The selector for relationLoator was broken. I've made an educated guess here.
    // 1. Click the dropdown to open the options.
    await page.locator('.css-19bb58m').first().click();

    // PAUSING THE TEST HERE.
    // The test is paused because the next step to select "Spouse" is failing.
    // Please inspect the page that opens in the browser.
    // Find the correct selector for the "Spouse" option in the dropdown.
    // You can also use the Playwright Codegen tool to record the correct steps.
    // Once you have the correct selector, update the line below and resume the test.
    await page.pause();

    // 2. Click the desired option. I'm choosing "Spouse" as an example.
    await page.getByText('Spouse', { exact: true }).click();

    await page.locator("//input[contains(@placeholder,'Enter Name')]").fill(newMemberName);
    await page.locator("(//input[@placeholder='Enter Age'])[1]").fill(age);
    await page.locator("(//input[@id='email'])[1]").fill(newEmail);
    await page.locator("(//input[@id='contact'])[1]").fill(newContact);

    // Save the new member
    await page.locator("(//button[normalize-space()='Save'])[1]").click();

    // Verify the success toast message
    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 10000 });
    const toastText = await toastLocator.textContent();
    console.log('Toast message:', toastText);
    await expect(toastLocator).toHaveText("Member is created successfully.");

    // Verify the member in the member list
    await page.getByRole('link', { name: 'Member List' }).click();
    await page.waitForURL('https://staging.corporate.welcomecure.com/hr/employee');

    const searchInput = page.locator("//input[@placeholder='Search By Member Name']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill(newMemberName);
    await page.waitForLoadState('networkidle');
    const memberInList = page.locator(`//tbody/tr[1]/td[1]/div[1]`);
    await expect(memberInList).toBeVisible();

    test.info().annotations.push({
      type: 'test-case-outcome',
      description: 'Member is created successfully and verified in the list.',
    });
  });
});
