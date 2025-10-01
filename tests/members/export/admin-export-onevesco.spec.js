import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage';

const adminLogin = {
    name: 'Admin',
    username: '9687298058',
    password: 'Cure@3210#',
    role: 'Admin',
    url: 'https://staging.corporate.welcomecure.com/admin/admin_user/corporate',
    memberListNav: async (page) => {
        await page.click("(//img[contains(@alt,'arrow')])[2]");
        await page.click("//a[normalize-space()='Onevasco']");
    }
};

test('Export from Partners -> Onevesco -> Member List Page', async ({ page }) => {
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
    });