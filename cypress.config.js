const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://serverest.dev",
    env: {
      EMAIL_USER_VALID: "testelucas@qa.com",
      SENHA_USER_VALID: "@LucasQA01"
    }
  }
})
