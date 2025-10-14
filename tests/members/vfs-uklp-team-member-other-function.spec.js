import { test, expect } from '@playwright/test';


const Login = {
  baseUrl: 'https://staging.corporate.welcomecure.com/vfs_uk_lp/login',
  credentials: {
    username: '9130231921',
    password: '123456',
  }}

//locators
const SEARCH_INPUT = "//input[contains(@placeholder,'Search By Name, Email, Contact No')]";
const ADMIN_TABLE_ROW = "//tbody/tr[1]/td[1]";
const NO_RECORDS_MSG = "//p[contains(@class,'text-xl font-Roboto')]";
const TOGGLE_SWITCH = "(//input[@id='68ee2869d3c8ea681a81976e'])[1]";
const PAGINATION_NEXT = "//div[@class='hidden text-sm md:block']//a[@aria-label='Next page'][normalize-space()='>']";
const ITEMS_PER_PAGE_DROPDOWN = "//img[@alt='LimitArrow']";


/*test.describe('Admin=> Team Member - Full Functionality', () => {
  test.beforeEach(async ({ page }) => {
    //const loginPage = new LoginPage(page);
    await loginPage.login('9130231921', '123456', 'Corporate');
    await page.waitForURL('https://staging.corporate.welcomecure.com/vfs_uk_lp/login');
    await page.click("//a[normalize-space()='Team Member']");
  });*/

// Search function test cases (Name/Email/Contact Number)

test('Search by valid admin name', async ({ page }) => {
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

// Pagination Test cases

 test('should display 10 team members by default', async ({ page }) => {
    const rowCount = await page.locator("//tbody/tr").count();
    expect(rowCount).toBe(10);
    await page.waitForTimeout(3000);
  });

test('should display 25 items when selecting 25 per page', async ({ page }) => {
    // Open items per page dropdown
    await page.locator(ITEMS_PER_PAGE_DROPDOWN).click();
    // Select 25 (assuming options appear as text/buttons)
    await page.locator('text=25').click();
    await page.waitForTimeout(1000);

    const rowCount = await page.locator("//tbody/tr").count();
    expect(rowCount).toBe(25);
    await page.waitForTimeout(3000);
  });

  test('should navigate to page 2 using Next button', async ({ page }) => {
    const firstRowPage1 = await page.locator(ADMIN_TABLE_ROW).textContent();

    await page.locator(PAGINATION_NEXT).click();
    await page.waitForTimeout(1000);

    const firstRowPage2 = await page.locator(ADMIN_TABLE_ROW).textContent();
    expect(firstRowPage2).not.toBe(firstRowPage1);

    const rowCount = await page.locator("//tbody/tr").count();
    expect(rowCount).toBe(10); // or 25, if you changed view
  });

test('should show correct number of items on last page', async ({ page }) => {
  const totalMemberLocator = page.locator("//p[contains(@class,'text-sm font-semibold')]");
  
  await expect(totalMemberLocator).toBeVisible();
  await expect(totalMemberLocator).toContainText('Total Member :');

  const totalCountText = await totalMemberLocator.textContent();
  const totalMembers = parseInt(totalCountText.match(/\d+/)[0], 10);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalMembers / itemsPerPage);
  const expectedLastPageItems = totalMembers % itemsPerPage || itemsPerPage;

  console.log(`Total Members: ${totalMembers}`);
  console.log(`Total Pages: ${totalPages}`);
  console.log(`Expected items on last page: ${expectedLastPageItems}`);

  // Log Page 1
  let currentPage = 1;
  let rowCount = await page.locator("//tbody/tr").count();
  console.log(`Page ${currentPage}: ${rowCount} members`);

  // Navigate to last page and log each page
  for (let i = 1; i < totalPages; i++) {
    await page.locator(PAGINATION_NEXT).click();
    await page.waitForTimeout(800);
    
    currentPage++;
    rowCount = await page.locator("//tbody/tr").count();
    console.log(`Page ${currentPage}: ${rowCount} members`);
  }

  // Final assertion
  expect(rowCount).toBe(expectedLastPageItems);
});

test('should reset to page 1 after performing a search', async ({ page }) => {
    // Go to page 2
    await page.locator(PAGINATION_NEXT).click();
    await page.waitForTimeout(2000);

    // Perform search
    await page.locator(SEARCH_INPUT).fill('Alianna');
    await page.locator(SEARCH_INPUT).press('Enter');
    await page.waitForTimeout(4000);

    // Should be back on page 1 with filtered results
    const rowCount = await page.locator("//tbody/tr").count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
    await page.locator(3000);

    // Optional: verify first result is "saloni"
    const firstResult = await page.locator("//tbody/tr[1]/td[1]").textContent();
    expect(firstResult.toLowerCase()).toContain('Saloni');
  });

 /*
  // Check Filters
async function getMemberCount(page) {
  const countText = await page.locator("//p[contains(@class,'text-sm font-semibold')]").textContent();
  const match = countText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Role Filter Only
test('Team Member - Filter by Role = Accountant', async ({ page }) => {
  // Get count BEFORE filter
await page.goto('https://staging.corporate.welcomecure.com/vfs_uk_lp/branch');
  await page.click("//a[normalize-space()='Team Members']");
  await page.waitForTimeout(2000);

  const countBefore = await getMemberCount(page);
  console.log(`Before filter - Total Members: ${countBefore}`);

  // Apply filter
  await page.locator("//button[normalize-space()='Filters']").click();
  await page.locator("//div[contains(@class,'xl:flex')]//div[1]//div[1]//div[1]//div[2]//div[1]//*[name()='svg']").click();
  await page.locator('.css-dq6lu7-option', { hasText: 'Accountant' }).click();
  await page.locator("//button[normalize-space()='Apply Filters']").click();
  await page.waitForTimeout(3000);

  // Get count AFTER filter
  const countAfter = await getMemberCount(page);
  console.log(`After filter (Accountant) - Total Members: ${countAfter}`);

  // Validate
  expect(countAfter).toBeLessThanOrEqual(countBefore);
  expect(countAfter).toBeGreaterThan(0);

  // Optional: Validate table content
  const totalRows = await page.locator('tbody tr').count();
  const roleCells = await page.locator('td:has-text("Accountant")').count();
  expect(roleCells).toBe(totalRows);
});

// Zone Filter Only
test.skip('Team Member - Filter by Role = Accountant', async ({ page }) => {
  // Get count BEFORE filter
await page.goto('https://staging.corporate.welcomecure.com/vfs_uk_lp/branch');
  await page.click("//a[normalize-space()='Team Members']");
  await page.waitForTimeout(2000);

  const countBefore = await getMemberCount(page);
  console.log(`Before filter - Total Members: ${countBefore}`);

  // Apply filter
  await page.locator("//button[normalize-space()='Filters']").click();
  await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[2]").click();
  await page.locator('.css-dq6lu7-option', { hasText: 'North' }).click();
  await page.locator("//button[normalize-space()='Apply Filters']").click();
  await page.waitForTimeout(3000);

  // Get count AFTER filter
  const countAfter = await getMemberCount(page);
  console.log(`After filter (Accountant) - Total Members: ${countAfter}`);

  // Validate
  expect(countAfter).toBeLessThanOrEqual(countBefore);
  expect(countAfter).toBeGreaterThan(0);

  // Optional: Validate table content
  const totalRows = await page.locator('tbody tr').count();
  const roleCells = await page.locator('td:has-text("Accountant")').count();
  expect(roleCells).toBe(totalRows);
});

// Status Filter Only
test.skip('Team Member - Filter by Status = Active', async ({ page }) => {
  
  await page.goto('https://staging.corporate.welcomecure.com/vfs_uk_lp/branch');
  await page.click("//a[normalize-space()='Team Members']");
  await page.waitForTimeout(2000);
  
  const countBefore = await getMemberCount(page);
  console.log(`Before filter - Total Members: ${countBefore}`);

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.locator('div:nth-child(2) > .css-b62m3t-container > .css-12x3uyk-control > .css-7gwid4 > .css-1xc3v61-indicatorContainer').click();
  await page.getByText('Active', { exact: true }).click();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForTimeout(3000);

  const countAfter = await getMemberCount(page);
  console.log(`After filter (Active) - Total Members: ${countAfter}`);

  expect(countAfter).toBeLessThanOrEqual(countBefore);
  expect(countAfter).toBeGreaterThan(0);
});

// Both Filters
test('Team Member - Filter by Role = Accountant and Status = Active', async ({ page }) => {

  await page.goto('https://staging.corporate.welcomecure.com/vfs_uk_lp/branch');
  await page.click("//a[normalize-space()='Team Members']");
  await page.waitForTimeout(2000);

  const countBefore = await getMemberCount(page);
  console.log(`Before filter - Total Members: ${countBefore}`);
  
  await page.locator("//button[normalize-space()='Filters']").click();
  await page.locator("(//*[name()='svg'][contains(@class,'css-8mmkcg')])[1]").click();
  await page.locator('.css-dq6lu7-option', { hasText: 'Accountant' }).click();
  await page.locator('div:nth-child(2) > .css-b62m3t-container > .css-12x3uyk-control > .css-7gwid4 > .css-1xc3v61-indicatorContainer').click();
  await page.getByText('Active', { exact: true }).click();
  await page.locator("//button[normalize-space()='Apply Filters']").click();
  await page.waitForTimeout(2000);

  const countAfter = await getMemberCount(page);
  console.log(`After filter (Accountant + Active) - Total Members: ${countAfter}`);

  expect(countAfter).toBeLessThanOrEqual(countBefore);
  expect(countAfter).toBeGreaterThan(0);
});
*/
//});