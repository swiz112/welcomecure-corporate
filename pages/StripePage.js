const BasePage = require('./BasePage');

class StripePage extends BasePage {
  constructor(page) {
    super(page);
    
    this.emailInput = "//input[@id='email']";
    this.cardNumberInput = "//input[@id='cardNumber']";
    this.cardExpiryInput = "//input[@id='cardExpiry']";
    this.cardCvcInput = "//input[@id='cardCvc']";
    this.cardholderNameInput = "//input[@id='billingName']";
    this.payButton = "//div[@class='SubmitButton-IconContainer']";
    this.verificationFrame = 'iframe[name^="challengeFrame"]';
    this.verificationCodeInput = '#challenge-input';
  }

  async completePayment(email, _mobile, cardDetails) {
    await this.page.waitForLoadState('networkidle');
    
    await this.type(this.cardNumberInput, cardDetails.number);
    await this.type(this.cardExpiryInput, cardDetails.expiry);
    await this.type(this.cardCvcInput, cardDetails.cvc);
    await this.type(this.cardholderNameInput, cardDetails.name);
    await this.type(this.emailInput, email);
    await this.click(this.payButton);

    
  }
}

module.exports = StripePage;