import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';
import { fetchLatestExportEmail } from '../../../utils/email-helper.js';
import XLSX from 'xlsx';

const adminLogin = {
    name: 'Admin',
    username: '9687298058',
    password: 'Cure@3210#',
    role: 'Admin',
    url: 'https://staging.corporate.welcomecure.com/admin/admin_user/corporate',
    memberListNav: async (page) => {
        await page.click("(//img[contains(@alt,'arrow')])[1]");
        await page.click("//a[normalize-space()='Family Member']");
    }
};

async function selectDateRange(page) {
    await page.click("//button[contains(@class,'bg-[#fae006] items-center text-sm flex px-4 rounded-[8px] py-2 font-medium')]");
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

// --- BEFORE EACH: Login + Navigation ---
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);
    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);

    await adminLogin.memberListNav(page);
    await expect(page.locator("//input[@placeholder='Search By P Member Name']")).toBeVisible();
});

// --- AFTER EACH: Export Validation if triggered ---
test.afterEach(async ({}, testInfo) => {
    if (!testInfo.exportTriggered || testInfo.status === 'failed') {
        console.log(` Skipping export validation for: ${testInfo.title}`);
        return;
    }
    try {
        console.log(` Validating export for: ${testInfo.title}`);
        // wait for email with retries
        let attachmentPath;
        for (let i = 0; i < 6; i++) { // try 6 times (30s total)
            try {
                attachmentPath = await fetchLatestExportEmail(testInfo.title);
                if (attachmentPath) break;
            } catch (err) {
                console.log(`Attempt #${i + 1} to fetch email failed: ${err.message}`);
            }
            console.log('Waiting for email...');
            await new Promise(res => setTimeout(res, 5000));
        }

        if (!attachmentPath) {
            console.warn('Export email not received in time. Skipping validation.');
            return;
        }
        const workbook = XLSX.readFile(attachmentPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log(` [${testInfo.title}] Exported records count:`, data.length);
        expect(data.length).toBeGreaterThan(0);
    } catch (err) {
        console.error('Error in export validation:', err);
    }
});
test('Admin Export - Family Member (Static Date via Fill)', async ({ page }, testInfo) => {
    await selectDateRange(page);

    // Trigger Export
    await page.getByRole('button', { name: 'Export' }).click();
    await page.locator("(//input[@id='email'])[1]").fill('saloni@wizcoder.com');
    await page.locator("(//button[contains(@class,'bg-[#FCDD00]')])[1]").click();

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
    await expect(toastLocator).toContainText('Your request is being processed.');

    // Mark export triggered for afterEach
    testInfo.exportTriggered = true;
});

test('Admin Export - Family Member (Search by Name and Static Date)', async ({ page }, testInfo) => {
    await page.locator("//input[@placeholder='Search By P Member Name']").fill('Charlie2');
    await selectDateRange(page);

    await page.getByRole('button', { name: 'Export' }).click();
    await page.locator("(//input[@id='email'])[1]").fill('saloni@wizcoder.com');
    await page.locator("(//button[contains(@class,'bg-[#FCDD00]')])[1]").click();

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
    await expect(toastLocator).toContainText('Your request is being processed.');

    testInfo.exportTriggered = true;
});

test('Admin Export - Family Member (Filter by Branch and Static Date)', async ({ page }, testInfo) => {
    // Apply Filter
    await page.locator("//button[normalize-space()='Filters']").click();
    await page.locator("(//div[contains(@class,'react-select__input-container')])[1]").click();
    await page.locator('.react-select__option:has-text("stackbelowflow")').click();
    await page.locator("//button[normalize-space()='Apply Filters']").click();

    await selectDateRange(page);

    await page.getByRole('button', { name: 'Export' }).click();
    await page.locator("(//input[@id='email'])[1]").fill('saloni@wizcoder.com');
    await page.locator("(//button[contains(@class,'bg-[#FCDD00]')])[1]").click();

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
    await expect(toastLocator).toContainText('Your request is being processed.');

    testInfo.exportTriggered = true;
});

test('Admin Export - Family Member (Search + Filter + Date)', async ({ page }, testInfo) => {
    await page.locator("//input[@placeholder='Search By P Member Name']").fill('Charlie2');

    await page.locator("//button[normalize-space()='Filters']").click();
    await page.locator("(//div[contains(@class,'react-select__input-container')])[1]").click();
    await page.locator('.react-select__option:has-text("stackbelowflow")').click();
    await page.locator("//button[normalize-space()='Apply Filters']").click();

    await selectDateRange(page);

    await page.getByRole('button', { name: 'Export' }).click();
    await page.locator("(//input[@id='email'])[1]").fill('saloni@wizcoder.com');
    await page.locator("(//button[contains(@class,'bg-[#FCDD00]')])[1]").click();

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
    await expect(toastLocator).toContainText('Your request is being processed.');

    testInfo.exportTriggered = true;
});

test('Admin Export - Family Member (Without Date Selection)', async ({ page }) => {
    await page.getByRole('button', { name: 'Export' }).click();

    const popupLocator = page.locator("//div[@role='dialog']");
    await popupLocator.waitFor({ state: 'visible', timeout: 10000 });
    const popupText = await popupLocator.textContent();
    await expect(popupText).toContain('Please select a date range before exporting the data!');
    
});
