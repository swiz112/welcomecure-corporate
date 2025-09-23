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
}

module.exports = RazorpayPage;