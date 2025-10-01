import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';

const adminLogin = {
    name: 'Admin',
    username: '9687298058',
    password: 'Cure@3210#',
    role: 'Admin',
    url: 'https://staging.corporate.welcomecure.com/admin/admin_user/corporate',
};

test('Admin Export - VFS UKLP - Refund', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);
    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);

    // Navigation to Partners -> VFS UKLP -> Refund Page
    await page.click('a[href="/admin/partner-list"]');
    await page.locator('//td[text()="VFS UKLP"]').locator('..').locator('button[aria-label="view"]').click();
    await page.click('button:has-text("Refund")');

    // Export logic
    await page.click("//button[normalize-space()='Export']");
    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 10000 });
    const toastText = await toastLocator.textContent();
    console.log('Toast message:', toastText);
    const successMessage = "Email sent successfully.";
    await expect(toastLocator).toHaveText(successMessage);
});
