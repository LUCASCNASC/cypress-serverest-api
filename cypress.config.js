const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "https://serverest.dev",
    env: {
      EMAIL_USER_VALID: process.env.EMAIL,
      SENHA_USER_VALID: process.env.PASSWORD,
    },
    setupNodeEvents(on, config) {
    },
  },
});
