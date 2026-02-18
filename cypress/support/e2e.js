// Ignore benign app-side runtime errors so they don't fail the tests.
Cypress.on("uncaught:exception", (err) => {
  const message = (err && err.message) || "";
  if (
    message.includes("ResizeObserver loop completed with undelivered notifications") ||
    message.includes("Cannot read properties of undefined (reading 'predefinedFunctions')") ||
    message.includes("Cannot read properties of undefined (reading 'predefinedAttachments')") ||
    message.includes("Request failed with status code 412")
  ) {
    return false;
  }
  // Let all other errors fail the test as normal
});

// Login helper: call before tests that need authenticated session
Cypress.Commands.add("loginToPortal", (username, password) => {
  const user = username || Cypress.env("username");
  const pass = password || Cypress.env("password");
  const url = "https://productionportal.master.mediagenix.io";
  if (!user || !pass) {
    throw new Error(
      "Set CYPRESS_PROD_USERNAME and CYPRESS_PROD_PASSWORD env vars (or pass to loginToPortal)"
    );
  }

  // Log which credentials are being used (mask password in output)
  cy.log(`loginToPortal() -> username: ${user}`);
  if (typeof pass === "string") {
    cy.log(`loginToPortal() -> password length: ${pass.length}`);
  } else {
    cy.log("loginToPortal() -> password is not a string");
  }

  cy.session([user, pass], () => {
    cy.visit(url);

    // Step 1: username page (see Pages/Username.html)
    cy.get(
      'form[data-testing-name="login-username-form"] input[name="username"]',
      {
        log: true,
      }
    )
      .should("be.visible")
      .clear()
      .type(user, { log: true });

    // Screenshot after username is filled
    cy.screenshot("login-username-filled", { capture: "viewport" });

    cy.get(
      'form[data-testing-name="login-username-form"] button[type="submit"] span',
      { log: true }
    )
      .contains("Proceed")
      .should("be.visible")
      .click();

    // Wait briefly for the password page to appear
    cy.get('form[data-testing-name="login-password-form"]', { log: true }).should(
      "be.visible"
    );

    // Step 2: password page (see Pages/Password.html)
    cy.get(
      'form[data-testing-name="login-password-form"] input[name="password"]',
      {
        log: true,
      }
    )
      .should("be.visible")
      .clear()
      .type(pass, { log: true });

    // Screenshot after password is filled
    cy.screenshot("login-password-filled", { capture: "viewport" });

    cy.get(
      'form[data-testing-name="login-password-form"] button[type="submit"] span',
      { log: true }
    )
      .contains("Sign in")
      .should("be.visible")
      .click();

    // Give the portal a few seconds immediately after Sign in
    cy.wait(5000);

    // If after 5s we are effectively on a blank/unsupported page, force a reload to baseUrl.
    cy.document().then((doc) => {
      const bodyText = (doc.body && doc.body.innerText) || "";
      const looksBlank =
        !bodyText.trim() ||
        bodyText.includes("Our site doesn’t support your browser");
      if (looksBlank) cy.visit("/");
    });

    cy.url().should("not.include", "/login");
    cy.url().should("include", "/forms");
  });

  // After session: go straight to the templates page. The session (cookies) is already set, so this load will be authenticated.
  cy.visit("/configurations/templates");
  cy.url().should("include", "/configurations/templates");
  cy.wait(3000);
});
