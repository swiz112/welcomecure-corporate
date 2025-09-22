// pages/RegisterFormPage.js
const BasePage = require('./BasePage');

class RegisterFormPage extends BasePage {
  constructor(page) {
    super(page);
    this.nameField = '#name';
    this.emailField = '#email';
    this.mobileField = '#contact';
    this.sourceCountry = '#sourceCountry';
    this.destinationCountry = '#destinationCountry';
    this.checkbox1 = 'div:has(span:has-text("I here by agree")) > input';
    this.checkbox2 = 'div:has(a:has-text("Terms & Conditions")) > input';
    this.submitButton = 'button[type="submit"]';
    this.errorMessages = '.error-message';
    this.disclaimerLink = 'text=Disclaimer';
  }
async scrollToForm() {
  const formLocator = '#register';
  await this.page.waitForSelector(formLocator, { state: 'visible', timeout: 60000 });
  await this.page.locator(formLocator).scrollIntoViewIfNeeded();
}

  async enterName(name) { await this.type(this.nameField, name); }
  async enterEmail(email) { await this.type(this.emailField, email); }
  async enterMobile(mobile) { await this.type(this.mobileField, mobile); }

  async selectSourceCountry(country) { await this.selectReactSelectOption(this.sourceCountry, country); }
  async selectDestinationCountry(country) { await this.selectReactSelectOption(this.destinationCountry, country); }

  async checkCheckbox1() { await this.check(this.checkbox1); }
  async checkCheckbox2() { await this.check(this.checkbox2); }

  async submitForm() { await this.click(this.submitButton); }
  async getErrors() { return await this.page.locator(this.errorMessages).allTextContents(); }

  async clickDisclaimer() {
    await this.click(this.disclaimerLink);
  }

  async closeDisclaimerModal() {
    await this.page.locator('div.flex:has(div:has-text("Disclaimer")) > button').click();
  }
}

module.exports = RegisterFormPage;
