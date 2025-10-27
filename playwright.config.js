// playwright.config.js

//require('dotenv').config();
const config = {
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['./excel-reporter.js', { outputFile: 'test-report.xlsx' }]
  ],
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    browserName: 'chromium'  // Chrome only
  },
  projects: [
    { name: 'Desktop Chrome', use: { browserName: 'chromium' } }
  ]
};

module.exports = config;
