const { test, expect } = require('@playwright/test');
const RegisterFormPage = require('../pages/RegisterFormPage');
const RazorpayPage = require('../pages/RazorpayPage');
const ThankYouPage = require('../pages/ThankYouPage');
const testData = require('../data/testData.json');
const { BASE_URL } = require('../utils/helpers');
const fs = require('fs');

test.describe('Payment Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    const registerPage = new RegisterFormPage(page);
    await registerPage.navigate(BASE_URL);
    await page.waitForLoadState('networkidle');
    await registerPage.scrollToForm();
    await registerPage.enterName(testData.name.positive[0]);
    await registerPage.enterEmail(testData.email.positive[0]);
    await registerPage.enterMobile(testData.mobile.positive[0]);
    await registerPage.selectSourceCountry(testData.countries.source);
    await registerPage.selectDestinationCountry(testData.countries.destination);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();
    await registerPage.submitForm();
  });

  // test('Successful Netbanking payment', async () => {
  //   const razorpayPage = new RazorpayPage(page);
  //   const thankYouPage = new ThankYouPage(page);

  //   await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], true);

  //   const thankYouMsg = await thankYouPage.getThankYouMessage();
  //   expect(thankYouMsg).toContain('Thank You');

  //   const receiptPath = await thankYouPage.downloadReceipt();
  //   expect(fs.existsSync(receiptPath)).toBeTruthy();
  // });

  // test('Failed Netbanking payment', async () => {
  //   const razorpayPage = new RazorpayPage(page);
  //   await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], false);
  //   // Add assertion for payment failure
  //   // For example, check if the URL is still the razorpay URL
  //   expect(page.url()).toContain('razorpay');
  // });

  // test('Successful Credit Card payment', async () => {
  //   const razorpayPage = new RazorpayPage(page);
  //   const thankYouPage = new ThankYouPage(page);

  //   await razorpayPage.completeCreditCardPayment(
  //     testData.mobile.positive[0],
  //     testData.creditCard.number,
  //     testData.creditCard.expiry,
  //     testData.creditCard.cvv,
  //     testData.creditCard.name
  //   );

  //   // This is an assumption. The success case for credit card might be different.
  //   // You might need to handle a 3D secure page.
  //   const thankYouMsg = await thankYouPage.getThankYouMessage();
  //   expect(thankYouMsg).toContain('Thank You');

  //   const receiptPath = await thankYouPage.downloadReceipt();
  //   expect(fs.existsSync(receiptPath)).toBeTruthy();
  // });
});
