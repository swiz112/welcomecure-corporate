// tests/registerForm.spec.js
const { test, expect } = require('@playwright/test');
const RegisterFormPage = require('../pages/RegisterFormPage');
const RazorpayPage = require('../pages/RazorpayPage');
const ThankYouPage = require('../pages/ThankYouPage');
const fs = require('fs');

const BASE_URL = 'https://staging.corporate.welcomecure.com/vfs_uk?_id=6899dd1d34920aa9c9d7b1d0';

const testData = {
  name: { positive: ['Saloni QA'], negative: ['123', '!@#$'] },
  email: { positive: ['saloni@yopmail.com'], negative: ['abc.com', 'user@'] },
  mobile: { positive: ['9712738076'], negative: ['123', 'abcd'] },
  countries: { source: 'India', destination: 'United States' },
  upi: { success: 'success@razorpay', failure: 'reject@razorpay' }
};

test.describe('Register Form Functional Test - Chrome Desktop', () => {

  test('Complete registration flow with all fields', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    const razorpayPage = new RazorpayPage(page);
    const thankYouPage = new ThankYouPage(page);
    
    // Navigate and scroll to form
    await registerPage.navigate(BASE_URL);
    await page.waitForLoadState('networkidle');
    await registerPage.scrollToForm();

    // Fill all fields
    await registerPage.enterName(testData.name.positive[0]);
    await registerPage.enterEmail(testData.email.positive[0]);
    await registerPage.enterMobile(testData.mobile.positive[0]);
    await registerPage.selectSourceCountry(testData.countries.source);
    await registerPage.selectDestinationCountry(testData.countries.destination);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();

    // Disclaimer link
    await registerPage.clickDisclaimer();
    await registerPage.closeDisclaimerModal();

    // Submit form
    await registerPage.submitForm();

    // Complete Netbanking Payment (success)
  await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], true);  

  // Payment is complete — main page should now show thank you
  const thankYouMsg = await thankYouPage.getThankYouMessage();
  expect(thankYouMsg).toContain('Thank You');

  // Download receipt
  const receiptPath = await thankYouPage.downloadReceipt();
  expect(fs.existsSync(receiptPath)).toBeTruthy();

    // Complete Netbanking Payment with failure 
 /*await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], true);  

    // Complete UPI Payment
    //await razorpayPage.completeUpiPayment(testData.mobile.positive[0], testData.upi.success);

    // Thank You page validation
    await page.waitForNavigation({ url: /thank-you/ });
    const thankYouMsg = await thankYouPage.getThankYouMessage();
    expect(thankYouMsg).toContain('Thank You');

    // Download receipt
    const receiptPath = await thankYouPage.downloadReceipt();
    expect(fs.existsSync(receiptPath)).toBeTruthy();*/

    // Go to homepage
    await thankYouPage.goToHome();
    expect(page.url()).toContain('homepage');
  });

  /*test('Failed registration with failed payment', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);
    const razorpayPage = new RazorpayPage(page);
    
    // Navigate and scroll to form
    await registerPage.navigate(BASE_URL);
    await page.waitForLoadState('networkidle');
    await registerPage.scrollToForm();

    // Fill all fields
    await registerPage.enterName(testData.name.positive[0]);
    await registerPage.enterEmail(testData.email.positive[0]);
    await registerPage.enterMobile(testData.mobile.positive[0]);
    await registerPage.selectSourceCountry(testData.countries.source);
    await registerPage.selectDestinationCountry(testData.countries.destination);
    await registerPage.checkCheckbox1();
    await registerPage.checkCheckbox2();

    // Disclaimer link
    await registerPage.clickDisclaimer();
    await registerPage.closeDisclaimerModal();

    // Submit form
    await registerPage.submitForm();

    // Complete UPI Payment with failing ID
    await razorpayPage.completeUpiPayment(testData.mobile.positive[0], testData.upi.failure);

    // Assert that the payment failed and we are still on the payment page
    expect(page.url()).toContain('razorpay');
  });*/

  /*test('Negative flow - mandatory fields empty', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);

    // Navigate and scroll to form
    await registerPage.navigate(BASE_URL);
    await registerPage.scrollToForm();

    // Validate that the submit button is disabled
    const submitButton = page.locator(registerPage.submitButton);
    await expect(submitButton).toBeDisabled();
  });
*/
  /*test('One-time URL restriction after payment', async ({ page }) => {
    const registerPage = new RegisterFormPage(page);

    // Revisit the same URL and scroll
    await registerPage.navigate(BASE_URL);
    await registerPage.scrollToForm();

    // Wait for network idle
    await page.waitForLoadState('networkidle');

    // Validate unique ID is removed from URL
    expect(page.url()).not.toContain('_id=6899dd1d34920aa9c9d7b1d0');

    // Validate form is not visible
    const isFormVisible = await page.locator('#register').isVisible();
    expect(isFormVisible).toBeFalsy();

    console.log('One-time URL restriction validated: Form not accessible and ID removed from URL.');
  });*/

});