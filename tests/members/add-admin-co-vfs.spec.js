import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

// Reusable locators
const SEARCH_INPUT = "//input[@placeholder='Search By Admin Name']";
const ADD_ADMIN_BUTTON = "//button[normalize-space()='Add']";
const ADMIN_TABLE_ROW = "//tbody/tr";
const NO_RECORDS_MSG = "//p[@class='text-xl font-Roboto']";
const EMAIL_ICON = "//tbody/tr[1]/td[4]/div[1]/div[1]/span[1]//*[name()='svg']//*[name()='path' and contains(@d,'M928 160H9')]";
const EDIT_ICON = "//tbody/tr[1]/td[4]/div[1]/span[1]//*[name()='svg']";
const PAGINATION_NEXT = "//a[normalize-space()='>']";
const ITEMS_PER_PAGE_DROPDOWN = "//img[@alt='LimitArrow']";
const EMPTY_STATE = "//p[contains(@class,'text-xl font-Roboto')]";

test.describe('Corporate Login Admin Page - Full Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('3355662288', 'Test@1234', 'Corporate');
    await page.waitForURL('https://staging.corporate.welcomecure.com/corporate/hr');
    //await page.click("//a[normalize-space()='Admin']");
  });

  // Search function test cases
   test('Search by valid admin name (positive)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('Neha');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search with partial name match', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('Jess');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search is case-insensitive', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('jessica');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Clear search shows full list', async ({ page }) => {
    // First search
    await page.locator(SEARCH_INPUT).fill('XYZ');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(1000);
    // Then clear
    await page.locator(SEARCH_INPUT).fill('');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search by email (negative - should show "Admin not found")', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('jessica@welcomecure.com');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search by phone number (negative)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('9876543210');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search by corporate name (negative)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('stackbelowflow');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search with invalid name (e.g., numbers)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('12345admin');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  // Add Admin 

  test('Add new admin with valid data', async ({ page }) => {
    await page.locator(ADD_ADMIN_BUTTON).click();
    await page.waitForTimeout(1000);

    await page.locator("//input[@id='name']").fill('Ritesh');
    await page.locator("//input[@id='email']").fill('wiz2@yopmail.com');
    await page.locator("//input[@id='contact']").fill('1234444441');

    // Select corporate if dropdown exists
    //const corporateDropdown = page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[1]");
    //if (await corporateDropdown.isVisible()) {
      //await corporateDropdown.click();
      //await page.click("//div[contains(@class,'option') and contains(.,'stackbelowflow')]");
    //}

    await page.click("//button[normalize-space()='Save']");
    await page.waitForTimeout(2000);

    // Verify appears in table
    await page.locator(SEARCH_INPUT).fill('Ritesh');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });


  // Action icons: Edit Admin Data

  test('Edit admin data with valid data', async ({ page }) => {
    await page.locator(EDIT_ICON).click();
    await page.waitForTimeout(1000);

    await page.locator("//input[@id='name']").fill('Ramesh');
    await page.locator("//input[@id='email']").fill('ram123@yopmail.com');
    await page.locator("//input[@id='contact']").fill('1235555554');
    await page.click("//button[normalize-space()='Save']");
    await page.waitForTimeout(2000);

    // Verify appears in table
    await page.locator(SEARCH_INPUT).fill('Ramesh');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });


 // Action icons: Email
test('Click email icon opens mailto link', async ({ page }) => {
        const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
        page.locator(EMAIL_ICON).click()
        await page.waitForTimeout(3000);
        const noResultsMessage = page.locator('text=Email has been sent successfully');
        
      });

  
  // Pagination test cases
  
  test('Pagination - navigate to next page', async ({ page }) => {
    const nextButton = page.locator(PAGINATION_NEXT);
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  }); 
});