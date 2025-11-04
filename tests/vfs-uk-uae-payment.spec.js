const { test, expect } = require('@playwright/test');
const RegisterFormPageUAE = require('../pages/RegisterForm-vfsuk-uae-Page.js');
const StripePage = require('../pages/StripePage');
const ThankYouPage = require('../pages/ThankYouPage');
const fs = require('fs');

test('Complete registration and Stripe payment flow', async ({ page }) => {
  const registerPage = new RegisterFormPageUAE(page);
  const stripePage = new StripePage(page);
  const thankYouPage = new ThankYouPage(page);

  const testData = {
    name: 'Alice',
    email: 'alice112@yopmail.com',
    mobile: '9999333311',
    journeyDate: '11/11/2025',
    destinationCountry: 'United Kingdom',
    cardDetails: {
      number: '4242 4242 4242 4242',
      expiry: '12 / 30',
      cvc: '123',
      name: 'Alice Tester'
    }
  };

  // Step 1: Navigate to registration form
  await registerPage.navigate('https://staging.corporate.welcomecure.com/vfsukuae?_id=68dccfa8f9a996d15168118d');
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
  await expect(page).toHaveURL(/vfsukuae/);
});