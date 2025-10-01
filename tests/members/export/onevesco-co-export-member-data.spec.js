import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';

const adminLogin = {
    name: 'Corporate',
    username: '8978989789',
    password: 'Test@1234',
    role: 'Corporate',
    url: 'https://staging.corporate.welcomecure.com/vfs/branch',
};

test('Onevesco-corporate Export - Memberlist Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);
    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);

   // Navigate to Member List page
  await page.click("//img[@alt='arrow']");
  await page.click("//a[normalize-space()='Member List']");
  await page.waitForURL('**/vfs/memberlist');
    // Export logic
    await page.click("//button[normalize-space()='Export']");
    const toastLocator = page.locator('.Toastify__toast-body');
    await toastLocator.waitFor({ state: 'visible', timeout: 10000 });
    const toastText = await toastLocator.textContent();
    console.log('Toast message:', toastText);
    const successMessage = "Email sent successfully.";
    await expect(toastLocator).toHaveText(successMessage);
});
