// tests/registerFormRegressionPOM.spec.js
const { test, expect } = require('@playwright/test');
const RegisterFormPage = require('../pages/RegisterFormPage');
const RazorpayPage = require('../pages/RazorpayPage');
const ThankYouPage = require('../pages/ThankYouPage');
const fs = require('fs');

const BASE_URL = 'https://staging.corporate.welcomecure.com/vfs_uk?_id=6899dd1d34920aa9c9d7b1d0';

// Test data
const testData = {
  name: {
    positive: ['John Doe', 'Alice Smith'],
    negative: ['12345', '!@#$%', '<script>alert(1)</script>']
  },
  email: {
    positive: ['test@example.com', 'user123@test.co'],
    negative: ['abc.com', 'user@', 'user@com']
  },
  mobile: {
    positive: ['9876543210', '9123456789'],
    negative: ['123', 'abcdefghij', '98765abcd0']
  },
  countries: {
    source: 'IN',
    destination: 'US'
  }
};

test.describe('Register Form Regression with POM', () => {

  // Mandatory fields
  test('Mandatory fields validation', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    await registerPage.navigate(BASE_URL);
    await registerPage.submitForm();
    const errors = await registerPage.getErrors();
    expect(errors.length).toBeGreaterThan(0);
  });

  // Negative regression
  for (let name of testData.name.negative) {
    for (let email of testData.email.negative) {
      for (let mobile of testData.mobile.negative) {
        test(`Negative Input: Name=${name}, Email=${email}, Mobile=${mobile}`, async ({ page }) => {
          const registerPage = new RegisterFormPage(page);
          await registerPage.navigate(BASE_URL);
          await registerPage.enterName(name);
          await registerPage.enterEmail(email);
          await registerPage.enterMobile(mobile);
          await registerPage.selectSourceCountry(testData.countries.source);
          await registerPage.selectDestinationCountry(testData.countries.destination);
          await registerPage.checkCheckbox1();
          await registerPage.checkCheckbox2();
          await registerPage.submitForm();

          const errors = await registerPage.getErrors();
          expect(errors.length).toBeGreaterThan(0);
        });
      }
    }
  }

  // Positive regression
  for (let name of testData.name.positive) {
    for (let email of testData.email.positive) {
      for (let mobile of testData.mobile.positive) {
        test(`Positive Input: Name=${name}, Email=${email}, Mobile=${mobile}`, async ({ page }) => {
          const registerPage = new RegisterFormPage(page);
          const razorpayPage = new RazorpayPage(page);
          const thankYouPage = new ThankYouPage(page);

          await registerPage.navigate(BASE_URL);
          await registerPage.enterName(name);
          await registerPage.enterEmail(email);
          await registerPage.enterMobile(mobile);
          await registerPage.selectSourceCountry(testData.countries.source);
          await registerPage.selectDestinationCountry(testData.countries.destination);
          await registerPage.checkCheckbox1();
          await registerPage.checkCheckbox2();
          await registerPage.submitForm();

          // Mock Razorpay payment
          await razorpayPage.completePayment();

          // Thank You validations
          const message = await thankYouPage.getThankYouMessage();
          expect(message).toContain('Thank You');

          const receiptPath = await thankYouPage.downloadReceipt();
          expect(fs.existsSync(receiptPath)).toBeTruthy();

          await thankYouPage.goToHome();
          expect(page.url()).toContain('homepage'); // replace with actual homepage URL
        });
      }
    }
  }

  // Disclaimer link
  test('Disclaimer link opens correctly', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    await registerPage.navigate(BASE_URL);
    const disclaimerPage = await registerPage.clickDisclaimer();
    expect(disclaimerPage.url()).toContain('disclaimer'); // replace with actual URL
  });

  // One-time URL restriction
  test('One-time payment URL restriction', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    await registerPage.navigate(BASE_URL);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Invalid/Expired Link');
  });

});
