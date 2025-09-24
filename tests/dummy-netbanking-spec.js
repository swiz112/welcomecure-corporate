 // Complete Netbanking Payment (success)
  //await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], true);  

  // Payment is complete — main page should now show thank you
  //const thankYouMsg = await thankYouPage.getThankYouMessage();
  //expect(thankYouMsg).toContain('Thank You');
  
    // Download receipt
  //const receiptPath = await thankYouPage.downloadReceipt();
  //expect(fs.existsSync(receiptPath)).toBeTruthy();

   
  
    // Complete Netbanking Payment with failure 
 /*await razorpayPage.completeNetbankingPayment(testData.mobile.positive[0], true);  */

    

   

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

  // Locators for Netbanking
    // NOTE: These are example selectors. You may need to update them based on the actual application.
    // this.netbankingPaymentMethod = 'button:has-text("Netbanking")';
    // this.bankSelect = 'select[name="bank"]'; // Assuming a select element for bank
    // this.payButton = 'button[data-testid="bottom-cta-button"]';
    // this.successButton = 'button.success'; // Assuming a success button on the bank page
    // this.failureButton = 'button.failure'; // Assuming a failure button on the bank page

    // Locators for Credit Card
    // NOTE: These are example selectors. You may need to update them based on the actual application.
    // this.cardPaymentMethod = 'button:has-text("Card")';
    // this.cardNumberField = 'input[name="card_number"]';
    // this.cardExpiryField = 'input[name="card_expiry"]';
    // this.cardCvvField = 'input[name="card_cvv"]';
    // this.cardNameField = 'input[name="card_name"]';

    // async completeNetbankingPayment(contactNumber, success = true) {
  //   console.log('Starting completeNetbankingPayment method...');
  //   const frame = this.page.frameLocator(this.iframe);
  //   console.log(`Entering contact number: ${contactNumber}`);
  //   await frame.locator(this.contactField).type(contactNumber);
  //   console.log('Clicking continue button...');
  //   await frame.locator(this.continueButton).click();

  //   console.log('Waiting for Netbanking payment method to be visible...');
  //   await frame.locator(this.netbankingPaymentMethod).waitFor({ state: 'visible' });
  //   console.log('Clicking Netbanking payment method...');
  //   await frame.locator(this.netbankingPaymentMethod).click();

  //   // This is an assumption. The actual bank selection might be different.
  //   console.log('Selecting a bank...');
  //   await frame.locator(this.bankSelect).selectOption('HDFC'); 

  //   console.log('Clicking pay button...');
  //   await frame.locator(this.payButton).click();

  //   // The following is a simulation of the bank's page.
  //   // You might need to handle a new page or context here.
  //   console.log('Handling bank page...');
  //   if (success) {
  //     console.log('Clicking success button...');
  //     // This will likely open a new page, so you might need to handle that
  //     await this.page.locator(this.successButton).click();
  //   } else {
  //     console.log('Clicking failure button...');
  //     await this.page.locator(this.failureButton).click();
  //   }

  //   console.log('completeNetbankingPayment method finished.');
  // }

  // async completeCreditCardPayment(contactNumber, cardNumber, expiry, cvv, name) {
  //   console.log('Starting completeCreditCardPayment method...');
  //   const frame = this.page.frameLocator(this.iframe);
  //   console.log(`Entering contact number: ${contactNumber}`);
  //   await frame.locator(this.contactField).type(contactNumber);
  //   console.log('Clicking continue button...');
  //   await frame.locator(this.continueButton).click();

  //   console.log('Waiting for Card payment method to be visible...');
  //   await frame.locator(this.cardPaymentMethod).waitFor({ state: 'visible' });
  //   console.log('Clicking Card payment method...');
  //   await frame.locator(this.cardPaymentMethod).click();

  //   console.log('Entering card details...');
  //   await frame.locator(this.cardNumberField).type(cardNumber);
  //   await frame.locator(this.cardExpiryField).type(expiry);
  //   await frame.locator(this.cardCvvField).type(cvv);
  //   await frame.locator(this.cardNameField).type(name);

  //   console.log('Clicking pay button...');
  //   await frame.locator(this.payButton).click();

  //   console.log('completeCreditCardPayment method finished.');
  // }
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