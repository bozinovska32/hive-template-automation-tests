# Hive Template Automation Tests

Cypress + Cucumber BDD automation for the **Template Management** feature in the Production Portal (Configuration Settings).

## Requirements

- **Node.js** (v18 or later recommended) and **npm**
- Git (for submission to GitHub/Bitbucket or similar)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure credentials in `.env` (no secrets in repo)**

   Create a `.env` file in the project root and set:

   - `CYPRESS_BASE_URL` – Production Portal URL (default: `https://productionportal.master.mediagenix.io`)
   - `CYPRESS_PROD_USERNAME` – Portal username
   - `CYPRESS_PROD_PASSWORD` – Portal password

   Example `.env`:

   ```bash
   CYPRESS_BASE_URL=https://productionportal.master.mediagenix.io
   CYPRESS_PROD_USERNAME=your-username
   CYPRESS_PROD_PASSWORD=your-password
   ```

   You can copy `.env.example` to `.env` and update values:

   ```bash
   cp .env.example .env
   ```

   Note: this project loads `.env` directly from `cypress.config.js`.

## Running tests

- **Interactive (Cypress UI):**

  ```bash
  npm run cy:open
  ```

- **Headless:**

  ```bash
  npm run cy:run
  ```
  or
  ```bash
  npm test
  ```

Run only scenarios with a given tag, e.g. `@smoke`:

```bash
npx cypress run --env filterSpecs=true --env specPattern="cypress/e2e/**/*.feature" -e TAGS="@smoke"
```

(Exact tag filtering depends on `@badeball/cypress-cucumber-preprocessor` configuration.)

## Windows batch scripts

For Windows users, this project includes `.bat` helpers so you can run everything from PowerShell/CMD without Bash.

- **Install all dependencies:**

  ```bat
  run-install-deps.bat
  ```

- **Run tests in headed Electron:**

  ```bat
  run-cypress-electron.bat
  ```

Recommended first-time flow on Windows:

1. Run `run-install-deps.bat`
2. Run `run-cypress-electron.bat`

## Approach

- **BDD:** Scenarios are written in Gherkin (`.feature` files) and implemented with Cucumber step definitions.
- **Scope:** Tests cover the Template Management user story: access to the Templates tab, creating and editing templates, success notification **"Template created"**, and persistence of settings after reload.
- **Selectors:** Step definitions use generic selectors (e.g. by text "Templates", "Create template", table/grid). You may need to adjust them in `cypress/e2e/templates.cy.js` and `cypress/support/e2e.js` to match the actual Production Portal markup (e.g. `data-testid`, roles, or classes).
- **Login:** `cypress/support/e2e.js` defines a `loginToPortal` command that uses the configured username/password. Update the login selectors there to match the portal’s login form.
- **Design references:** When available, use the reference images from `requirements/images` (e.g. `config-portal.png`, `config-tab.png`, `config-template.png`) to align selectors and flows with the UI.

## Project structure

```
├── cypress/
│   ├── e2e/
│   │   ├── templates.feature    # Gherkin scenarios
│   │   └── templates.cy.js      # Step definitions
│   └── support/
│       └── e2e.js               # Commands (e.g. login)
├── cypress.config.js
├── .cypress-cucumber-preprocessorrc.json
├── .env.example                 # Template env vars (copy to .env)
├── package.json
├── README.md
└── Manual_Test_Cases_Template_Management.csv   # Manual test cases (open in Excel)
```

## Manual test cases

An **Excel-compatible CSV** with manual test cases for Template Management feature validation is provided: **Manual_Test_Cases_Template_Management.csv**. Open it in Excel to edit or print.

## Submission

- **Cypress project:** This repo (README + at least one Cucumber automated test as required).
- **Excel file:** `Manual_Test_Cases_Template_Management.csv` (manual test cases for feature validation).
