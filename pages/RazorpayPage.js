const BasePage = require('./BasePage');

class RazorpayPage extends BasePage {
  constructor(page) {
    super(page);
    this.iframe = 'iframe.razorpay-checkout-frame';
    this.contactField = "//input[@placeholder='Mobile number']";
    this.continueButton = "//button[@name='button']";
    
    this.upiPaymentMethod = '[data-value="upi"]';
    this.vpaField = '[name="vpa"]';
    this.verifyAndPayButton = 'button[data-testid="bottom-cta-button"]';

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
  }

  async completeUpiPayment(contactNumber, upiId) {
    console.log('Starting completeUpiPayment method...');
    const frame = this.page.frameLocator(this.iframe);
    console.log(`Entering contact number: ${contactNumber}`);
    await frame.locator(this.contactField).type(contactNumber);
    console.log('Clicking continue button...');
    
    await frame.locator(this.continueButton).click();
    console.log('Waiting for UPI payment method to be visible...');
    await frame.locator(this.upiPaymentMethod).waitFor({ state: 'visible' });
    console.log('Clicking UPI payment method...');
    await frame.locator(this.upiPaymentMethod).click();
    console.log('Waiting for VPA field to be visible...');
    await frame.locator(this.vpaField).waitFor({ state: 'visible' });
    console.log(`Entering UPI ID: ${upiId}`);
    await frame.locator(this.vpaField).type(upiId);
    await frame.locator(this.verifyAndPayButton).waitFor({ state: 'visible' });
    await frame.locator(this.verifyAndPayButton).click();

    console.log('completeUpiPayment method finished.');
  }

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
}

module.exports = RazorpayPage;