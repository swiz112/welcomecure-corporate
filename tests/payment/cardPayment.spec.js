// tests/cardPayment.spec.js
const { test, expect } = require('@playwright/test');
const RegisterFormPage = require('../../pages/RegisterFormPage');
const RazorpayPage = require('../../pages/RazorpayPage');
const ThankYouPage = require('../../pages/ThankYouPage');
const fs = require('fs');

const BASE_URL = 'https://staging.corporate.welcomecure.com/vfs_uk?_id=6899dd1d34920aa9c9d7b1d0';

const testData = {
  name: 'Saloni QA',
  email: 'saloni@yopmail.com',
  mobile: '9712738076',
  countries: { source: 'India', destination: 'United States' },
  cards: {
    Mastercard: {
      cardnumber: '2305 3242 5784 8228',
      mmyy: '11/27',
      cvv: '111'
    }
  }
  
};

test.describe('Card Payment Functional Test', () => {

  test('Complete registration and payment with domestic card - success', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    const razorpayPage = new RazorpayPage(page);
    const thankYouPage = new ThankYouPage(page);

    // Navigate and fill form
    await registerPage.navigate(BASE_URL);
    await page.waitForLoadState('networkidle');
    await registerPage.scrollToForm();
    await registerPage.enterName(testData.name);
    await registerPage.enterEmail(testData.email);
    await registerPage.enterMobile(testData.mobile);
    await registerPage.selectSourceCountry(testData.countries.source);
    await registerPage.selectDestinationCountry(testData.countries.destination);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();
    await registerPage.submitForm();

    // Complete Card Payment
    await razorpayPage.completeCardPayment(testData.mobile, testData.cards.Mastercard, true);

    // Thank You page validation
    await page.waitForNavigation({ url: /thankyou/ });
    const thankYouMsg = await thankYouPage.getThankYouMessage();
    expect(thankYouMsg).toContain('Payment Successful!');
    const receiptPath = await thankYouPage.downloadReceipt();
    expect(fs.existsSync(receiptPath)).toBeTruthy();
    await thankYouPage.goToHome();
    expect(page.url()).toContain('vfs_uk');
  });

  /*test('Complete registration and payment with domestic card - failure', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    const razorpayPage = new RazorpayPage(page);

    // Navigate and fill form
    await registerPage.navigate(BASE_URL);
    await page.waitForLoadState('networkidle');
    await registerPage.scrollToForm();
    await registerPage.enterName(testData.name);
    await registerPage.enterEmail(testData.email);
    await registerPage.enterMobile(testData.mobile);
    await registerPage.selectSourceCountry(testData.countries.source);
    await registerPage.selectDestinationCountry(testData.countries.destination);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();
    await registerPage.submitForm();

    // Complete Card Payment
    await razorpayPage.completeCardPayment(testData.mobile, testData.cards.Mastercard, false);

    // Assert that the payment failed and we are still on the payment page
    expect(page.url()).toContain('razorpay');
  });*/
});
