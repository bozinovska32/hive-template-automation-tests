const path = require("path");
const fs = require("fs");

// Load credentials from .env only (.env.example is template-only)
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) require("dotenv").config({ path: envFile });

const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.name === "chrome" || browser.family === "chromium") {
      launchOptions.args = launchOptions.args || [];
      launchOptions.args.push("--incognito");
    }
    return launchOptions;
  });

  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl:
      process.env.CYPRESS_BASE_URL ||
      "https://productionportal.master.mediagenix.io",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    env: {
      // Loaded from .env (or process env vars)
      username: process.env.CYPRESS_PROD_USERNAME || "",
      password: process.env.CYPRESS_PROD_PASSWORD || "",
    },
  },
});
