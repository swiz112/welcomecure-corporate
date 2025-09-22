// pages/ThankYouPage.js
const BasePage = require('./BasePage');

class ThankYouPage extends BasePage {
  constructor(page) {
    super(page);
    this.thankYouMessage = 'h1';
    this.downloadReceiptButton = '#download-receipt';
    this.homeButton = '#home-btn';
  }

  async getThankYouMessage() { return await this.getText(this.thankYouMessage); }

  async downloadReceipt() {
    const [ download ] = await Promise.all([
      this.page.waitForEvent('download'),
      this.click(this.downloadReceiptButton)
    ]);
    return await download.path();
  }

  async goToHome() { await this.click(this.homeButton); }
}

module.exports = ThankYouPage;
