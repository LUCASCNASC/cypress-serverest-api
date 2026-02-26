const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    // Puxa a URL do .env ou usa a oficial como fallback
    baseUrl: process.env.BASE_URL || "https://serverest.dev",
    env: {
      // Mapeia as variáveis do sistema/dotenv para o Cypress
      EMAIL_USER_VALID: process.env.EMAIL,
      SENHA_USER_VALID: process.env.PASSWORD,
    },
    setupNodeEvents(on, config) {
      // Implemente node event listeners aqui se necessário
    },
  },
});
