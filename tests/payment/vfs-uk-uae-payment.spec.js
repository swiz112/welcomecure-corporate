const { test, expect } = require('@playwright/test');
const RegisterFormPageUAE = require('../../pages/RegisterForm-vfsuk-uae-Page.js');
const StripePage = require('../../pages/StripePage');
const ThankYouPage = require('../../pages/ThankYouPage');
const fs = require('fs');
const { faker } = require('@faker-js/faker');

const numberOfRuns = 15;

for (let i = 1; i <= numberOfRuns; i++) {
  test(`Complete registration and Stripe payment flow - Run ${i}`, async ({ page }) => {
    const registerPage = new RegisterFormPageUAE(page);
    const stripePage = new StripePage(page);
    const thankYouPage = new ThankYouPage(page);
    const randomName = faker.person.fullName();
    const testData = {
      name: randomName,
      email: faker.internet.email({ provider: 'yopmail.com' }),
      mobile: (Math.floor(Math.random() * (9999999999 - 6000000000)) + 6000000000).toString(),
      journeyDate: '14/11/2025',
      destinationCountry: 'American Samoa',
      cardDetails: {
        number: '4242 4242 4242 4242',
        expiry: '12 / 30',
        cvc: '123',
        name: randomName
      }
    };

    // Step 1: Navigate to registration form
    //await registerPage.navigate('https://staging.corporate.welcomecure.com/vfsukuae?_id=68dccfa8f9a996d15168118d');  --uae
      //await registerPage.navigate('https://staging.corporate.welcomecure.com/vfsbahrain?_id=6909bb242d10c0b6a70b0d12');  1
      await registerPage.navigate('https://staging.corporate.welcomecure.com/vfsbahrain?_id=6904599ad4b03b380657b96f');

    await page.waitForTimeout(3000);
    // Wait for the app to load (React app needs JS)
    await registerPage.scrollToForm();

    // Step 2: Fill registration form
    await registerPage.enterName(testData.name);
    await registerPage.enterEmail(testData.email);
    await registerPage.enterMobile(testData.mobile);
    await registerPage.enterTravelStartDate(testData.journeyDate);
    await registerPage.selectDestinationCountry(testData.destinationCountry);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();

    // Submit form → redirects to payment
    await registerPage.submitForm();

    // Step 3-7: Complete Stripe Payment
    await stripePage.completePayment(testData.email, testData.mobile, testData.cardDetails);

    // Step 8 & 9: Thank You page validation
    await page.waitForURL(/thankyou/);
    const receiptPath = await thankYouPage.downloadReceipt('receipt.pdf');
    expect(fs.existsSync(receiptPath)).toBeTruthy();
    await thankYouPage.goToHome();

    // Final assertion
    await expect(page).toHaveURL(/vfsbahrain/);
    //await expect(page).toHaveURL(/vfsuae/);
  });
}