import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

//locators
const SEARCH_INPUT = "//input[@placeholder='Search By Name, Email, Contact No']";
const ADD_TEAM_MEMBER = "//button[normalize-space()='Add']";
const ADMIN_TABLE_ROW = "//tbody/tr[1]/td[1]";
const NO_RECORDS_MSG = "//p[@class='text-xl font-Roboto']";
const TOGGLE_SWITCH = "(//input[@id='68e9f9eec82cf468b6ffe572'])[1]";
const EMAIL_ICON = "//tbody/tr[9]/td[6]/div[1]/span[2]//*[name()='svg']";
const EDIT_ICON = "//tbody/tr[1]/td[6]/div[1]/span[1]//*[name()='svg']";
const PAGINATION_NEXT = "//div[contains(@class,'hidden text-sm md:block')]//a[contains(@aria-label,'Next page')][normalize-space()='>']";
const ITEMS_PER_PAGE_DROPDOWN = "//img[@alt='LimitArrow']";

test.describe('Admin Page - Full Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('9687298058', 'Cure@3210#', 'Admin');
    await page.waitForURL('https://staging.corporate.welcomecure.com/admin/admin_user/corporate');
    await page.click("//a[normalize-space()='Team Members']");
  });

// Search function test cases (Name/Email/Contact Number)

  /* test('Search by valid admin name', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('Olivia');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search by valid Email', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('	saloni1@yopmail.com');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search by valid Contact No', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('6767676767');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search with partial name match', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('Oli');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search is case-insensitive', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('olivia');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Clear search shows full list', async ({ page }) => {
    // First search
    await page.locator(SEARCH_INPUT).fill('Jasmine');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(1000);
    // Then clear
    await page.locator(SEARCH_INPUT).fill('');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const rowCount = await page.locator(ADMIN_TABLE_ROW).count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Search by Invalid Email (negative - should show "Admin not found")', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('jessicawelcomecure.com');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search by Invalid phone number ', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('9876543210454354353');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search by Corporate name (negative)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('stackbelowflow');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });

  test('Search with Invalid Name (e.g., numbers)', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('12345admin');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(2000);
    const noRecords = await page.locator(NO_RECORDS_MSG).isVisible();
    expect(noRecords).toBeTruthy();
  });
  
// Status
test('Toggle admin status (Active ↔ Inactive)', async ({ page }) => {
  const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
  if (initialRowCount === 0) {
    console.log('No admins to toggle. Skipping.');
    return;
  }
  const toggle = page.locator(TOGGLE_SWITCH).first();
  const beforeClass = await toggle.getAttribute('class');
  await toggle.click();
  await page.waitForTimeout(2000);

  const afterClass = await toggle.getAttribute('class');
  expect(afterClass).not.toBe(beforeClass);
});

// Action icons: Email, Edit
  test('Click email icon opens mailto link', async ({ page }) => {
    const initialRowCount = await page.locator(ADMIN_TABLE_ROW).count();
    page.locator(EMAIL_ICON).click()
    await page.waitForTimeout(3000);
    const noResultsMessage = page.locator('text=Team member credentials have been sent successfully');
});

const validMember = {
  name: 'Elee',
  email: 'elee44@example.com',
  contact: '501234563', 
};
test('should add team member with valid data and one permission', async ({ page }) => {
    await page.locator(ADD_TEAM_MEMBER).click();
    await expect(page.getByText('Add Team Member')).toBeVisible();

    // Fill valid data
    await page.locator("//input[@id='name']").fill(validMember.name);
    await page.locator("//input[@id='email']").fill(validMember.email);
    await page.locator("(//div[contains(@class,'css-19bb58m')])[1]").click();
    await page.getByText('+852', { exact: true }).click();
    await page.locator("//input[@id='contact']").fill(validMember.contact);
    await page.locator("(//*[name()='svg'][@class='css-8mmkcg'])[2]").click();
    await page.locator('.css-dq6lu7-option', { hasText: 'Support' }).click();

    // Select only one permission
    await page.getByLabel('Corporate', { exact: true }).check();
    

    await page.getByRole('button', { name: 'Save' }).click();

    // Verify success
    await expect(page.getByText('Team member created successfully')).toBeVisible({ timeout: 5000 });
    
  });

  test('should add team member with all permissions selected', async ({ page }) => {
    await page.locator(ADD_TEAM_MEMBER).click();
    await expect(page.getByText('Add Team Member')).toBeVisible();

    await page.locator('input#name').fill('Paull');
    await page.locator('input#email').fill('paull126@example.com');
    await page.locator("(//div[contains(@class,'css-19bb58m')])[1]").click();
    await page.getByText('+354', { exact: true }).click();
    await page.locator('input#contact').fill('5555555');
    await page.locator("(//*[name()='svg'][@class='css-8mmkcg'])[2]").click();
    await page.locator('.css-dq6lu7-option', { hasText: 'Manager' }).click();
    
    // Select all permissions
    await page.getByLabel('Select All').check();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Team member created successfully')).toBeVisible();
   
  });
// this is not working ----- unable to find locator for validation msg---------------------
test('should add team member with  invalid data with all permissions selected', async ({ page }) => {
    await page.locator(ADD_TEAM_MEMBER).click();
    await expect(page.getByText('Add Team Member')).toBeVisible();

    await page.locator('input#name').fill(' ');
    await page.locator('input#email').fill('paulexample@yopmail.com');
    await page.locator("(//div[contains(@class,'css-19bb58m')])[1]").click();
    await page.getByText('+354', { exact: true }).click();
    await page.locator('input#contact').fill(' ');
    await page.locator("(//*[name()='svg'][@class='css-8mmkcg'])[2]").click();
    await page.locator('.css-dq6lu7-option', { hasText: 'Manager' }).click();
    
    // Select all permissions
    await page.getByLabel('Select All').check();

    await page.getByRole('button', { name: 'Save' }).click();

     const anyErrorMessage = page.locator('Please fill in this field').or(page.getByText('Please fill out this field')).or(page.getByText('At least one permission is required'));

// Wait for any of them to be visible
await expect(anyErrorMessage).toBeVisible({ timeout: 5000 });

    // Pop-up should remain openok
    await expect(page.getByText('Add Team Member')).toBeVisible(); 
  });
*/

/*test('Team Member - Filter', async ({ page }, testInfo) => {
    
    await page.locator("//button[normalize-space()='Filters']").click();
    await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[1]").click();
    await page.locator('.css-dq6lu7-option', { hasText: 'Accountant' }).click();
    await page.locator("//button[normalize-space()='Apply Filters']").click();
    await page.waitForTimeout(3000);
    
    const totalRows = await page.locator('tbody tr').count();
    const roleCells = await page.locator('td:has-text("Accountant")').count();
    expect(roleCells).toBe(totalRows); 
    expect(totalRows).toBeGreaterThan(0);

});*/


// Status Filter Only
test('Team Member - Filter by Status = Active', async ({ page }) => {
  await page.locator("//button[normalize-space()='Filters']").click();
  await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[2]").click();
  await page.getByText('Active', { exact: true }).click();
  await page.locator("//button[normalize-space()='Apply Filters']").click();
  await page.waitForTimeout(3000);

  const totalRows = await page.locator('tbody tr').count();
  const activeCells = await page.locator('td:has-text("Active")').count(); 
  expect(activeCells).toBe(totalRows);
  expect(totalRows).toBeGreaterThan(0);
});
// Both Filters: Role = Accountant AND Status = Active
/*test('Team Member - Filter by Role = Accountant and Status = Active', async ({ page }) => {
  await page.locator("//button[normalize-space()='Filters']").click();
  
  // Select Role
  await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[1]").click();
  await page.locator('.css-dq6lu7-option', { hasText: 'Accountant' }).click();
  
  // Select Status
  await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[2]").click();
  await page.locator('.css-dq6lu7-option', { hasText: 'Active' }).click();
  
  await page.locator("//button[normalize-space()='Apply Filters']").click();
  await page.waitForTimeout(3000);

  const totalRows = await page.locator('tbody tr').count();
  const roleCells = await page.locator('td:has-text("Accountant")').count();
  const statusCells = await page.locator('td:has-text("Active")').count();
  
  expect(roleCells).toBe(totalRows);
  expect(statusCells).toBe(totalRows);
  expect(totalRows).toBeGreaterThan(0);
});

*/


// //img[@alt='new']  - clear filter
});
