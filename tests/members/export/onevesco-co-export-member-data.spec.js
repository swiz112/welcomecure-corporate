import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';

const adminLogin = {
    name: 'Corporate',
    username: '8978989789',
    password: 'Test@1234',
    role: 'Corporate',
    url: 'https://staging.corporate.welcomecure.com/vfs/branch',
    memberListNav: async (page) => {
        
         await page.click("(//img[contains(@alt,'arrow')])[1]");
         await page.click("//a[normalize-space()='Member List']");
         //await page.waitForURL('**/vfs/memberlist');
    }
};

test('Onevesco-corporate Export - Memberlist Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${adminLogin.name}...`);
    await loginPage.login(adminLogin.username, adminLogin.password, adminLogin.role);
    await page.waitForURL(adminLogin.url);
    await adminLogin.memberListNav(page);

   await expect(page.locator("//input[contains(@placeholder,'Search By Member, Email, Contact No')]")).toBeVisible({ timeout: 30000 });
    
        // Click "Select Date" button to reveal date inputs
            await page.click("//button[normalize-space()='Select Date']");
        
            //  Fill the date fields
            await page.locator("//div[contains(@class,'rdrDateDisplayWrapper')]");
            
            //await page.pause();
            await page.locator("//input[@placeholder='Early']").click();
            await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']").click();
            await page.locator("//button[contains(@class,'rdrDay rdrDayStartOfMonth')]//span[contains(@class,'rdrDayNumber')]").click();
            await page.locator("//button[contains(@class,'rdrNextPrevButton rdrNextButton')]").click();
            await page.locator("//input[contains(@placeholder,'Continuous')]").click();
            await page.locator("(//span[@class='rdrDayNumber'])[4]").click();
            
            // Click Export 
            await page.getByRole('button', { name: 'Export' }).click();
            const toastLocator = page.locator('.Toastify__toast-body');
            await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
            const toastText = await toastLocator.textContent();
            console.log('Toast message:', toastText);
        
            await expect(toastText).toContain('Your request is being processed. The download file will be sent to');
            const expectedEmail = 'prasad@yopmail.com';
        await expect(toastLocator).toHaveText(`Your request is being processed. The download file will be sent to ${expectedEmail}`);
        });
