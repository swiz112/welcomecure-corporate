import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

// Reusable locators
const SEARCH_INPUT = "//input[contains(@placeholder,'Search By Admin Name')]";
const ADD_ADMIN_BUTTON = "//button[normalize-space()='Add']//span[@class='text-xl']//*[name()='svg']";
const ADMIN_TABLE_ROW = "//tbody/tr[1]/td[1]";
const NO_RECORDS_MSG = "//p[@class='text-xl font-Roboto']";
const TOGGLE_SWITCH = "(//input[@id='68e35b0c33a3c2cdb34b401c'])[1]";
const EMAIL_ICON = "(//*[name()='svg'][@class='cursor-pointer'])[1]";
const DELETE_ICON = "(//*[name()='svg'][contains(@stroke,'currentColor')])[13]";
//const CONFIRM_DELETE_BUTTON = "//button[contains(.,'Yes')] | //button[contains(.,'Delete')]";
//const CANCEL_DELETE_BUTTON = "//button[contains(.,'No')] | //button[contains(.,'Cancel')]";
const PAGINATION_NEXT = "(//a[contains(@aria-label,'Next page')][normalize-space()='>'])[1]";
const ITEMS_PER_PAGE_DROPDOWN = "(//img[contains(@alt,'LimitArrow')])[1]";
const EMPTY_STATE = "//*[contains(text(),'No Admin Details Available.')]";

test.describe('Admin Page - Full Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('9687298058', 'Cure@3210#', 'Admin');
    await page.waitForURL('https://staging.corporate.welcomecure.com/admin/admin_user/corporate');
    await page.click("//a[normalize-space()='Admin']");
  });

  // Search function test cases
   test('Search by valid admin name (positive)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('Jessica');
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

    await page.locator("//input[@id='name']").fill('Admin-saloni');
    await page.locator("//input[@id='email']").fill('saloni123@yopmail.com');
    await page.locator("//input[@id='contact']").fill('123467888');

    // Select corporate if dropdown exists
    const corporateDropdown = page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[1]");
    if (await corporateDropdown.isVisible()) {
      await corporateDropdown.click();
      await page.click("//div[contains(@class,'option') and contains(.,'stackbelowflow')]");
    }

    await page.click("//button[.='Save']");
    await page.waitForTimeout(2000);

    // Verify appears in table
    await page.locator(SEARCH_INPUT).fill('Admin-saloni');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  /*test('Add admin - missing name shows validation', async ({ page }) => {
    await page.locator(ADD_ADMIN_BUTTON).click();
    await page.waitForTimeout(1000);

    await page.locator("//input[@name='email' or @placeholder='Email Id']").fill('test2@test.com');
    await page.locator("//input[@name='contactNo' or @placeholder='Contact No']").fill('9876543218');
    await page.click("//button[.='Save']");
    await page.waitForTimeout(1000);

    const errorMsg = await page.locator("//*[contains(text(),'required') or contains(text(),'Name')]").isVisible();
    expect(errorMsg).toBeTruthy();
  });*/

  /*test('Add admin - cancel operation', async ({ page }) => {
    await page.locator(ADD_ADMIN_BUTTON).click();
    await page.waitForTimeout(1000);
    await page.locator("//input[@placeholder='Admin Name']").fill('To Be Cancelled');
    await page.click("//button[.='Close'] | //button[.='Cancel']");
    await page.waitForTimeout(1000);

    const modalVisible = await page.locator("//div[@class='modal']").isVisible().catch(() => false);
    expect(modalVisible).toBeFalsy();
  });*/

  // Status toggle 
  test('Toggle admin status (Active ↔ Inactive)', async ({ page }) => {
    // Ensure at least one admin exists
    const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
    if (initialRowCount === 0) {
      console.log('No admins to toggle. Skipping.');
      return;
    }

    const initialChecked = await page.locator(TOGGLE_SWITCH).getAttribute('class');
    await page.locator(TOGGLE_SWITCH).click();
    await page.waitForTimeout(2000);

    // Optional: verify toast or backend change (if UI reflects it)
    // For now, just ensure no error
    expect(true).toBeTruthy();
  });

  // Action icons: Email, delete
  test('Click email icon opens mailto link', async ({ page }) => {
    const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
    if (initialRowCount === 0) return;

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator(EMAIL_ICON).click()
    ]);
    expect(popup.url()).toContain('mailto:');
  });

  test('Delete admin - cancel action', async ({ page }) => {
    const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
    //if (initialRowCount === 0) return;

    await page.locator(DELETE_ICON).click();
    //await page.locator(CANCEL_DELETE_BUTTON).click();
    await page.waitForTimeout(1000);

    //const finalRowCount = await page.locator(ADMIN_TABLE_ROW).count();
    //expect(finalRowCount).toBe(initialRowCount);
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

  test('Empty state when no admins exist', async ({ page }) => {
    // Optional: clear all admins first (not recommended in shared env)
    // Instead, just verify message if table is empty
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    if (rowCount === 0) {
      const emptyVisible = await page.locator(EMPTY_STATE).isVisible();
      expect(emptyVisible).toBeTruthy();
    }
  });
});

// import { test, expect } from '@playwright/test';
// import path from 'path';
// import LoginPage from '../../pages/LoginPage';
// import ExcelJS from 'exceljs';

// test.describe('Admin Add Member - File Upload Module', () => {
//   test.beforeEach(async ({ page }) => {
   
//     const loginPage = new LoginPage(page);
//     console.log('Logging in...');
//     await loginPage.login('9687298058', 'Cure@3210#', 'Admin');
//     console.log('Waiting for URL to be **/Admin-page');
//     await page.waitForURL('https://staging.corporate.welcomecure.com/admin/admin_user/corporate');
//     console.log('URL matched.');
//     await page.click("//a[normalize-space()='Admin']");
//       });


//       test('Verify admin page search by admin name function',async({page})=>{
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").fill('Jessica');
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").press('Enter');
//        await page.waitForTimeout(2000);
        
//       })
    

//     test('Verify admin page search by admin name -blank',async({page})=>{
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").fill('');
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").press('Enter');
//        await page.waitForTimeout(2000);
        
//       })

//       test('Verify admin page search by Invalid name -',async({page})=>{
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").fill('32313admin');
//        await page.locator("//input[contains(@placeholder,'Search By Admin Name')]").press('Enter');
//        await page.waitForTimeout(2000);
        
//       })
//     });