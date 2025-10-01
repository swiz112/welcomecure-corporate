import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';
import path from 'path';

const hrLogin = {
    name: 'HR',
    username: '4242425656',
    password: 'Test@1234',
    role: 'HR',
    url: 'https://staging.corporate.welcomecure.com/hr/uploademployee',
    memberListNav: async (page) => {
        await page.goto('https://staging.corporate.welcomecure.com/hr/member-list');
    }
};

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

test('Export Member Data - HR', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${hrLogin.name}...`);
    await loginPage.login(hrLogin.username, hrLogin.password, hrLogin.role);
    console.log(`Waiting for URL to be ${hrLogin.url}`);
    await page.waitForURL(hrLogin.url);

    await hrLogin.memberListNav(page);

    await expect(page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]")).toBeVisible();

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const fromDate = getFormattedDate(firstDayOfMonth);
    const toDate = getFormattedDate(today);

    await page.locator('input[name="fromDate"]').fill(fromDate);
    await page.locator('input[name="toDate"]').fill(toDate);

    await page.click("//button[normalize-space()='Export']");

    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 10000 });
    const toastText = await toastLocator.textContent();
    console.log('Toast message:', toastText);

    const successMessage = "Email sent successfully.";
    await expect(toastLocator).toHaveText(successMessage);

    test.info().annotations.push({
        type: 'test-case-outcome',
        description: `Member data export initiated successfully for ${hrLogin.name}.`,
    });
});
