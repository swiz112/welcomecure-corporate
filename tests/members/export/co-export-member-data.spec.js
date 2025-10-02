import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';
import path from 'path';

const coLogin = {
    name: 'Corporate (CO)',
    username: '3355662288',
    password: 'Test@1234',
    role: 'Corporate',
    url: 'https://staging.corporate.welcomecure.com/corporate/hr',
    memberListNav: async (page) => {
        await page.click("(//img[@alt='arrow'])[1]");
        await page.click("//a[normalize-space()='Member List']");
    }
};
test('Export Member Data - Corporate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    console.log(`Logging in as ${coLogin.name}...`);
    await loginPage.login(coLogin.username, coLogin.password, coLogin.role);
    console.log(`Waiting for URL to be ${coLogin.url}`);
    await page.waitForURL(coLogin.url);

    await coLogin.memberListNav(page);

    await expect(page.locator("//input[@placeholder='Search By Member Name']")).toBeVisible();
    
        // Click "Select Date" button to reveal date inputs
            await page.click("//button[contains(@class,'bg-[#fae006] flex items-center text-sm px-4 rounded-[8px] py-2 font-medium')]");
        
            //  Fill the date fields
            await page.locator("//div[@class='rdrDateDisplayWrapper']");
            
            //await page.pause();
            await page.locator("//input[@placeholder='Early']").click();
            await page.locator("//button[@class='rdrNextPrevButton rdrPprevButton']").click();
            await page.locator("//button[contains(@class,'rdrDay rdrDayStartOfMonth')]//span[contains(@class,'rdrDayNumber')]").click();
            await page.locator("//button[contains(@class,'rdrNextPrevButton rdrNextButton')]").click();
            await page.locator("//input[contains(@placeholder,'Continuous')]").click();
            await page.locator("(//span[@class='rdrDayNumber'])[4]").click();
            
            // Click Export 
            await page.getByRole('button', { name: 'Export' }).click();
           // await page.locator("(//input[@id='email'])[1]").fill('saloni@yopmail.com');
            //await page.locator("(//button[@class='w-full bg-[#FCDD00] text-black py-3 px-4 rounded-lg hover:bg-[#FCDD00] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium'])[1]").click();
            
            const toastLocator = page.locator('.Toastify__toast-body');
            await toastLocator.waitFor({ state: 'visible', timeout: 15000 });
            const toastText = await toastLocator.textContent();
            console.log('Toast message:', toastText);
        
            await expect(toastText).toContain('Your request is being processed. The download file will be sent to');
            const expectedEmail = 'vaibhav@yopmail.com';
        await expect(toastLocator).toHaveText(`Your request is being processed. The download file will be sent to ${expectedEmail}`);
        });