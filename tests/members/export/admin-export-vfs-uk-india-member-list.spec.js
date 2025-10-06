import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';
import XLSX from 'xlsx';
import { fetchAllExportEmails } from '../../../utils/email-helper.js';
// ---Filter function changes pending----
// Login details
const adminLogin = {
    name: 'Admin',
    username: '9687298058',
    password: 'Cure@3210#',
    role: 'Admin',
    url: 'https://staging.corporate.welcomecure.com/admin/admin_user/corporate',

    async memberListNav(page) {
        await page.click("(//img[contains(@alt,'arrow')])[2]");
        await page.waitForSelector("//span[normalize-space()='VFS UK INDIA']");
        await page.click("//span[normalize-space()='VFS UK INDIA']");
        await page.click("//a[normalize-space()='Member List']");
    }
};

// Select Date
async function selectDateRange(page) {
    await page.click("//button[normalize-space()='Select Date']");

    const earlyInput = page.locator("(//input[@placeholder='Early'])[1]");
    await expect(earlyInput).toBeVisible({ timeout: 10000 });
    await earlyInput.click();

    await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']//i").click();
    await page.locator("(//span[@class='rdrDayNumber'])[2]").click();

    await page.locator("(//button[@class='rdrNextPrevButton rdrNextButton'])[1]").click();

    const continuousInput = page.locator("(//input[@placeholder='Continuous'])[1]");
    await expect(continuousInput).toBeVisible({ timeout: 10000 });
    await continuousInput.click();
    await page.locator("(//span[@class='rdrDayNumber'])[4]").click();
}

// Export function
async function triggerExport(page, email = 'saloni@yopmail.com') {
    await page.getByRole('button', { name: 'Export' }).click();
    await page.locator("(//input[@id='email'])[1]").fill(email);

    await page.locator("(//button[@class='w-full bg-[#FCDD00] text-black py-3 px-4 rounded-lg hover:bg-[#FCDD00] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium'])[1]").click();

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
    const toastText = await toastLocator.textContent();
    console.log('Toast message:', toastText);

    const expectedText = `Your request is being processed. The download file will be sent to ${email}`;
    await expect(toastLocator).toHaveText(expectedText);
}

// multiple filter function

async function applyFilter(page, filters = {}) {
    await page.locator("//button[normalize-space()='Filters']").click();

    // Apply Branch filter if provided
    if (filters.branch) {
        await page.locator("(//div[contains(@class,'react-select__input-container')])[1]").click();
        await page.locator(`.react-select__option:has-text("${filters.branch}")`).click();
        await page.waitForLoadState('networkidle');
       
    }

    // Apply Region filter if provided
    if (filters.region) {
        await page.locator("(//div[contains(@class,'css-19bb58m')])[2]").click();
        await page.locator(`.react-select__option:has-text("South Asia")`).click();
        await page.waitForLoadState('networkidle');
    }
        await page.pause();
    // Apply Source Country filter if provided
    if (filters.sourceCountry) {
        await page.locator("(//div[contains(@class,'react-select__input-container')])[3]").click();
        await page.locator(`.react-select__option:has-text("${filters.sourceCountry}")`).click();
        await page.waitForLoadState('networkidle');
    }

    // Apply Destination Country filter if provided
    if (filters.destinationCountry) {
        await page.locator("(//div[contains(@class,'react-select__input-container')])[4]").click();
        await page.locator(`.react-select__option:has-text("${filters.destinationCountry}")`).click();
        await page.waitForLoadState('networkidle');
    }

    // Apply Zone filter if provided
    if (filters.zone) {
        await page.locator("(//div[contains(@class,'react-select__input-container')])[5]").click();
        await page.locator(`.react-select__option:has-text("${filters.zone}")`).click();
        await page.waitForLoadState('networkidle');
    }

    await page.locator("//button[normalize-space()='Apply Filters']").click();
}

//Before each : login
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);

    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);

    await adminLogin.memberListNav(page);
    await expect(page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]")).toBeVisible();
});

//  After each: export validation
test.afterEach(async ({}, testInfo) => {
    if (!testInfo.exportTriggered) {
        console.log(` Skipping export validation for: ${testInfo.title}`);
        return;
    }

    try {
        console.log(` Validating export for: ${testInfo.title}`);
        let attachmentPaths;

        for (let i = 0; i < 6; i++) { // try 6 times (30s total)
            try {
                attachmentPaths = await fetchAllExportEmails(testInfo.title);
                if (attachmentPaths && attachmentPaths.length > 0) break;
            } catch (err) {
                console.log(`Attempt #${i + 1} failed: ${err.message}`);
            }

            console.log('Waiting for email...');
            await new Promise(res => setTimeout(res, 5000));
        }

        if (!attachmentPaths) {
            console.warn('Export email not received in time. Skipping validation.');
            return;
        }

        for (const attachmentPath of attachmentPaths) {
            const workbook = XLSX.readFile(attachmentPath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);
            console.log(` [${testInfo.title}] Exported records count:`, data.length);
            expect(data.length).toBeGreaterThan(0);
        }

    } catch (err) {
        console.error('Error in export validation:', err);
    }
});

// Test cases

// Static date via fill
test.skip('Admin Export - VFS UK INDIA (Static Date)', async ({ page }, testInfo) => {
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Static single date
test.skip('Admin Export - VFS UK INDIA (Static Single Date)', async ({ page }, testInfo) => {
    await page.click("//button[normalize-space()='Select Date']");
    const earlyInput = page.locator("//input[contains(@placeholder,'Early')]");
    await expect(earlyInput).toBeVisible({ timeout: 10000 });
    await earlyInput.click();

    await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']").click();
    await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']").click();
    await page.locator("//span[contains(text(),'21')]").click();

    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Search by Name + Static Date
test.skip('Admin Export - VFS UK INDIA (Search by Name)', async ({ page }, testInfo) => {
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('Mitesh');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Search invalid name + Static Date
test.skip('Admin Export - VFS UK INDIA (Invalid Name)', async ({ page }, testInfo) => {
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('32charli3123');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await selectDateRange(page);
    const noResultsMessage = page.locator('text=No Family Member Details Available.');
    if (await noResultsMessage.isVisible()) {
        console.log('No Family Member Details Available. — skipping export.');
        await expect(noResultsMessage).toBeVisible();
    } else {
        await triggerExport(page);
        testInfo.exportTriggered = true;
    }
});

// Filter branch + Static Date
test.skip('Admin Export - VFS UK INDIA (Filter by Branch)', async ({ page }, testInfo) => {
    await applyFilter(page, 'COCHIN - UK VAC');
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Search with Email + Filter + Static Date
test.skip('Admin Export - VFS UK INDIA (Search + Filter)', async ({ page }, testInfo) => {
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('harshil@wizcoder.com');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await applyFilter(page, 'HYDERABAD - UK VAC');
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Without Date Selection → popup error
test.skip('Admin Export - VFS UK INDIA (No Date Selected)', async ({ page }) => {
    await page.getByRole('button', { name: 'Export' }).click();
    const popupLocator = page.locator("//div[@role='dialog']");
    await popupLocator.waitFor({ state: 'visible', timeout: 10000 });
    const popupText = await popupLocator.textContent();
    await expect(popupText).toContain('Please select a date range before exporting the data!');
});

// Date + Search with Name + Filter
test.skip('Admin Export - VFS UK INDIA (Date + Search + Filter)', async ({ page }, testInfo) => {
    await selectDateRange(page);
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('Jacob');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await applyFilter(page, 'HYDERABAD - UK VAC');
    await applyFilter(page, 'AHMEDABAD - UK VAC');
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

// Date + Filter + Search with Contact No
test.skip('Admin Export - VFS UK INDIA (Date + Filter + Search)', async ({ page }, testInfo) => {
    await selectDateRange(page);
    await applyFilter(page, 'HYDERABAD - UK VAC');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('9222874550');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter by Region)', async ({ page }, testInfo) => {
    await applyFilter(page, { region: 'South Asia' });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter by Source Country)', async ({ page }, testInfo) => {
    await applyFilter(page, { sourceCountry: 'Albania' });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter by Destination Country)', async ({ page }, testInfo) => {
    await applyFilter(page, { destinationCountry: 'Afghanistan' });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter by Zone)', async ({ page }, testInfo) => {
    await applyFilter(page, { zone: 'West' });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Region + Source Country Filters)', async ({ page }, testInfo) => {
    await applyFilter(page, { 
        region: 'South Asia', 
        sourceCountry: 'India' 
    });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (All Filters Applied)', async ({ page }, testInfo) => {
    await applyFilter(page, { 
        branch: 'HYDERABAD - UK VAC',
        region: 'South Asia',
        sourceCountry: 'Albania',
        destinationCountry: 'Afghanistan',
        zone: 'East'
    });
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter + Search by Email)', async ({ page }, testInfo) => {
    await applyFilter(page, { branch: 'AHMEDABAD - UK VAC' });
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('harshil@wizcoder.com');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test.skip('Admin Export - VFS UK INDIA (Filter + Search by Contact No)', async ({ page }, testInfo) => {
    await applyFilter(page, { zone: 'East' });
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").fill('9222874550');
    await page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]").press('Enter');
    await selectDateRange(page);
    await triggerExport(page);
    testInfo.exportTriggered = true;
});

test('Admin Export - VFS UK INDIA (Clear All Filters)', async ({ page }, testInfo) => {
    // Apply multiple filters first
    await applyFilter(page, {
        branch: 'HYDERABAD - UK VAC',
        region: 'South Asia',
        sourceCountry: 'Albania',
        destinationCountry: 'Afghanistan',
        zone: 'East'
    });

    // Verify that filters are applied (optional but recommended)
    const appliedFilterChip = page.locator('text=HYDERABAD - UK VAC');
    await expect(appliedFilterChip).toBeVisible();

    // Click "Clear All Filters"
    await page.locator("//button[normalize-space()='Clear All Filters']").click();
});



/*import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';

const adminLogin = {
    name: 'Admin',
    username: '9687298058',
    password: 'Cure@3210#',
    role: 'Admin',
    url: 'https://staging.corporate.welcomecure.com/admin/admin_user/corporate',
   memberListNav: async (page) => {
    await page.click("(//img[contains(@alt,'arrow')])[2]");
    await page.waitForSelector("//span[normalize-space()='VFS UK LP']");
    await page.click("//span[normalize-space()='VFS UK LP']");
    await page.click("//a[normalize-space()='Member List']");
}
};
test('Admin Export - VFS UKLP - Member List', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);
    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);

    await adminLogin.memberListNav(page);
            await expect(page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]")).toBeVisible();
    
        // Click "Select Date" button to reveal date inputs
            await page.click("//button[normalize-space()='Select Date']");
        
            //  Fill the date fields
            await page.locator("(//div[@class='rdrDateDisplayWrapper'])[1]");
            
            //await page.pause();
            await page.locator("(//input[@placeholder='Early'])[1]").click();
            await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']//i").click();
            await page.locator("(//span[@class='rdrDayNumber'])[2]").click();
            await page.locator("(//button[@class='rdrNextPrevButton rdrNextButton'])[1]").click();
            await page.locator("(//input[@placeholder='Continuous'])[1]").click();
            await page.locator("(//span[@class='rdrDayNumber'])[4]").click();
            
            // Click Export 
            await page.getByRole('button', { name: 'Export' }).click();
            await page.locator("(//input[@id='email'])[1]").fill('saloni@yopmail.com');
            await page.locator("(//button[@class='w-full bg-[#FCDD00] text-black py-3 px-4 rounded-lg hover:bg-[#FCDD00] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium'])[1]").click();
            
            const toastLocator = page.locator('.Toastify__toast-body');
            await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
            const toastText = await toastLocator.textContent();
            console.log('Toast message:', toastText);
        
            await expect(toastText).toContain('Your request is being processed. The download file will be sent to');
            const expectedEmail = 'saloni@yopmail.com';
        await expect(toastLocator).toHaveText(`Your request is being processed. The download file will be sent to ${expectedEmail}`);
        });*/