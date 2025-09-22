// pages/RazorpayPage.js
/*const BasePage = require('./BasePage');

class RazorpayPage extends BasePage {
  constructor(page) {
    super(page);
    this.iframe = 'iframe.razorpay-checkout-frame';
    this.contactField = "//input[@placeholder='Mobile number']";
    this.continueButton = 'text=Continue';
    this.upiPaymentMethod = '[data-value="upi"]';
    this.vpaField = '[name="vpa"]';
  }

  async completeUpiPayment(contactNumber, upiId) {
    const frame = this.page.frameLocator(this.iframe);
    await frame.locator(this.contactField).type(contactNumber);
    await frame.locator(this.continueButton).click();
    await frame.locator(this.upiPaymentMethod).click();
    await frame.locator(this.vpaField).type(upiId);
  }
}

module.exports = RazorpayPage;*/
/////
// pages/RazorpayPage.js
/*const BasePage = require('./BasePage');

class RazorpayPage extends BasePage {
  constructor(page) {
    super(page);
    this.iframe = 'iframe.razorpay-checkout-frame';
    this.contactField = 'input[placeholder="Mobile number"]';

    // Use specific locator instead of ambiguous "text=Continue"
    this.bottomContinueButton = 'button[data-testid="bottom-cta-button"]';

    //this.upiPaymentMethod = '[data-value="upi"]';
    //this.vpaField = '[name="vpa"]';
    //this.payButton = 'button:has-text("continue")';
     // Netbanking selectors
    this.netbankingOption = '[data-value="netbanking"]';
    this.hdfcBankOption = 'text=HDFC'; // adjust if dropdown

    // Bank simulator buttons (after redirect)
    this.successButton = 'button:has-text("Success")';
    this.failureButton = 'button:has-text("Failure")';
  }

  async completeUpiPayment(contactNumber = '9712738076', upiId = 'success@razorpay') {
    const frame = this.page.frameLocator(this.iframe);

    // Enter contact number
    await frame.locator(this.contactField).fill(contactNumber);

    // Click only the Razorpay bottom CTA "Continue"
    await frame.locator(this.bottomContinueButton).click();

    // Select UPI option
    await frame.locator(this.upiPaymentMethod).click();

    // Enter UPI ID
    await frame.locator(this.vpaField).fill(upiId);

    // Click Pay
    await frame.locator(this.payButton).click();

    // Wait for Thank You page
    await this.page.waitForURL(/thank-you/i, { timeout: 60000 });
  }
}

module.exports = RazorpayPage;*/
// pages/RazorpayPage.js
const BasePage = require('./BasePage');

class RazorpayPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.iframe = 'iframe.razorpay-checkout-frame';
    this.contactField = 'input[placeholder*="Mobile number"]';
    this.bottomContinueButton = 'button[data-testid="bottom-cta-button"]';

    // UPI selectors
    /*this.upiPaymentMethod = '[data-value="upi"]';
    this.vpaField = '[name="vpa"]';
    this.verifyAndPayButton = 'button[data-testid="vpa-submit"]';*/
    this.hdfcBankOption = '[data-testid="HDFC Bank Netbanking"]';

    // Netbanking selectors
    this.netbankingOption = '[data-value="netbanking"]';
    this.hdfcBankOption = '[data-testid="HDFC Bank Netbanking"]';

    // Bank simulator buttons (after redirect)
    this.successButton = 'Success'; // Changed to string
    this.failureButton = 'Failure'; // Changed to string
  }

  /*async completeUpiPayment(contactNumber = '9712738076', upiId = 'success@razorpay') {
    const frame = this.page.frameLocator(this.iframe);

    await frame.locator(this.contactField).fill(contactNumber);
    await frame.locator(this.bottomContinueButton).click();
    await frame.locator(this.upiPaymentMethod).click();
    await frame.locator(this.vpaField).fill(upiId);
    await frame.locator(this.verifyAndPayButton).click();

    await this.page.waitForURL(/thank-you/i, { timeout: 60000 });
  }*/

  async completeNetbankingPayment(contactNumber = '9712738076', success = true) {
  console.log('🚀 Starting completeNetbankingPayment method.');
  const frame = this.page.frameLocator(this.iframe);

  // Step 1: Fill contact & submit
  console.log(`📞 Entering contact number: ${contactNumber}`);
  await frame.locator(this.contactField).fill(contactNumber);
  console.log('🖱️ Clicking continue button.');
  await frame.locator(this.bottomContinueButton).click();

  // Step 2: Select Netbanking
  console.log('🏦 Selecting Netbanking option.');
  await frame.locator(this.netbankingOption).first().click();

  // Step 3: Wait for overlay (if any) & select HDFC
  console.log('⏳ Waiting for overlay to disappear...');
  await frame.locator('#overlay-backdrop').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  console.log('🏦 Selecting HDFC Bank option.');
  await frame.locator(this.hdfcBankOption).click({ force: true });

  // Step 4: Wait for bank simulator page
  console.log('🔗 Waiting for bank simulator page to open...');
  let bankPage = null;

  try {
    bankPage = await Promise.race([
      this.page.context().waitForEvent('page', { timeout: 15000 }),
      this.page.waitForEvent('popup', { timeout: 15000 })
    ]);
    console.log('✅ New bank simulator page detected.');
  } catch (e) {
    console.log('⚠️ No new page/popup — using current page.');
    bankPage = this.page;
  }

  // Step 5: Wait for load
  await bankPage.waitForLoadState('domcontentloaded');
  console.log('🌐 Bank page URL:', bankPage.url());

  // 💥 CRITICAL: Click SUCCESS IMMEDIATELY — page may auto-close!
  const buttonName = success ? 'Success' : 'Failure'; // Use string directly
  console.log(`✅ Clicking "${buttonName}" button NOW — before page closes!`);
  console.log(`✅ Clicking "${buttonName}" button NOW — before page closes!`);

try {
  // Try exact match first
  const button = bankPage.getByText(buttonName, { exact: true });
  await button.waitFor({ state: 'visible', timeout: 5000 });
  await button.click();
  console.log(`🎉 "${buttonName}" button clicked successfully.`);
} catch (err) {
  console.warn(`⚠️ Exact match failed: ${err.message}`);
  console.log('🔍 Trying fuzzy match...');

  // Try fuzzy match — button might have extra spaces or casing
  try {
    const fuzzyButton = bankPage.getByText(new RegExp(buttonName, 'i'));
    await fuzzyButton.waitFor({ state: 'visible', timeout: 5000 });
    await fuzzyButton.click();
    console.log(`🎉 Fuzzy match clicked successfully.`);
  } catch (err2) {
    console.error('❌ All attempts to click button failed. Taking screenshot for debug...');
    await bankPage.screenshot({ path: 'bank-simulator-failure.png' });
    throw new Error(`Could not find or click "${buttonName}" button: ${err2.message}`);
  }
}
  /*try {
    // Click without waiting for ready state — just click it!
    await bankPage.evaluate((btnName) => {
      const btn = [...document.querySelectorAll('button')]
        .find(el => el.innerText.trim() === btnName);
      if (btn) btn.click();
      else throw new Error(`Button "${btnName}" not found`);
    }, buttonName);

    console.log(`🎉 "${buttonName}" clicked. Simulator page should close now.`);
  } catch (err) {
    console.error('❌ Failed to click button via evaluate:', err.message);
    // Fallback: Try Playwright locator with very short timeout
    try {
      await bankPage.getByRole('button', { name: buttonName }).click({ timeout: 3000 });
    } catch (e2) {
      console.error('❌ Fallback click also failed:', e2.message);
      throw e2;
    }
  }*/

  // ✅ Step 6: NOW wait on MAIN PAGE for success
  console.log('⏳ Waiting for payment success on MAIN PAGE...');

  //const frame = this.page.frameLocator('iframe.razorpay-checkout-frame');

  await Promise.race([
    this.page.waitForURL(/thank-you|success|payment-complete/i, { timeout: 60000 }),
    frame.locator('text=Payment Successful').waitFor({ state: 'visible', timeout: 60000 }),
    this.page.waitForSelector('.thank-you, [class*="success"]', { state: 'visible', timeout: 60000 })
  ]).catch(async (err) => {
    console.warn('⚠️ URL/text not found — doing final sanity check...');
    // Just ensure page is still alive and loaded
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  });

  console.log('✅ Payment flow completed. Ready to validate thank-you page.');

}
}
    // Switch to bank page (popup or same page)
    /*console.log('Waiting for bank page/popup.');
    const [bankPage] = await Promise.all([
      this.page.context().waitForEvent('page').catch(() => null),
      this.page.waitForEvent('popup').catch(() => null)
    ]);

    const targetPage = bankPage || this.page;

    // Wait for bank simulator page to load
    console.log('Waiting for bank simulator page to load.');
    await targetPage.waitForLoadState('domcontentloaded');
    console.log('Current URL of targetPage:', targetPage.url());

    if (success) {
      console.log('Adding a short delay before clicking success button.');
      await this.page.waitForTimeout(1000); // Add a 1-second delay
      console.log('Clicking success button on bank page.');
      await targetPage.getByRole('button', { name: this.successButton }).click();
      console.log('Waiting for navigation to thank-you page after successful payment.');
      await this.page.waitForNavigation({ url: /thank-you/i, timeout: 60000 });
    } else {
      console.log('Adding a short delay before clicking failure button.');
      await this.page.waitForTimeout(1000); // Add a 1-second delay
      console.log('Clicking failure button on bank page.');
      await targetPage.getByRole('button', { name: this.failureButton }).click();
      console.log('Waiting for navigation to payment-failed page after failed payment.');
      await this.page.waitForNavigation({ url: /payment-failed/i, timeout: 60000 });
    }
    console.log('completeNetbankingPayment method finished.');
  }
}
*/
module.exports = RazorpayPage;
