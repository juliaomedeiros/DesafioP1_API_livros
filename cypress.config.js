const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'https://demoqa.com',
    apiUser: '/Account/v1/User',
    apiGenerateToken: '/Account/v1/GenerateToken',
    apiAuthorized: '/Account/v1/Authorized',
    apiBooks: '/BookStore/v1/Books'
  }
});
