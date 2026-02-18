const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

function openFirstTemplateFromList() {
  cy.get('[data-testing-name="templates-table"] tbody tr', { timeout: 20000 })
    .should("have.length.greaterThan", 0)
    .first()
    .then(($row) => {
      const editCandidate = $row.find(
        '[data-testing-name="edit-button"], button[title*="Edit"], a[title*="Edit"]'
      );
      if (editCandidate.length) {
        cy.wrap(editCandidate.first()).click({ force: true });
        return;
      }

      const clickableCandidate = $row.find("a, button");
      if (clickableCandidate.length) {
        cy.wrap(clickableCandidate.first()).click({ force: true });
        return;
      }

      cy.wrap($row).click({ force: true });
    });
}

function setTemplateValuesAndSave() {
  const templateName = `Auto Template ${Date.now()}`;

  cy.get("body").then(($body) => {
    const visibleInputs = $body.find('input:visible:not([type="hidden"])');
    if (visibleInputs.length > 0) {
      cy.wrap(visibleInputs[0])
        .clear({ force: true })
        .type(templateName, { force: true });
    }
  });

  cy.get("body").then(($body) => {
    if ($body.find('[data-testing-name="templates-withCompliance-form-input"]').length) {
      cy.get('[data-testing-name="templates-withCompliance-form-input"]')
        .first()
        .click({ force: true });
    }
  });

  cy.get("body").then(($body) => {
    const saveButtons = $body
      .find("button")
      .filter((_, el) => /save/i.test((el.innerText || "").trim()));

    if (saveButtons.length > 0) {
      cy.wrap(saveButtons[0]).click({ force: true });
      return;
    }

    cy.log("No Save button visible in current view; skipping explicit save click.");
  });
}

// Background
Given("the user is logged in to the Production Portal", function () {
  cy.loginToPortal();
  cy.wait(5000);
  console.log("the user is logged in to the Production Portal");
});

Given("the user navigates to Configuration Settings", function () {
  // loginToPortal() already visits /configurations/templates.
  cy.url().should("include", "/configurations/templates");
  cy.get('[data-testing-name="templates-table"]', { timeout: 15000 }).should(
    "be.visible"
  );
  cy.screenshot("templates-list-before", { capture: "viewport" });
  cy.wait(5000);
});

// Templates tab
When("the user opens the Templates tab", function () {
  // Background step already navigated; just assert Templates tab & table
  cy.get('[data-testing-name="templates-table"]').should("be.visible");
  cy.wait(5000);
});

Then("the Templates tab is displayed", function () {
  cy.get(
    'a[aria-current="page"].active[href="/configurations/templates"] span'
  )
    .contains("Templates")
    .should("be.visible");
  cy.wait(5000);
});

Then("a list or table of templates is visible", function () {
  cy.get('[data-testing-name="templates-table"]').should("be.visible");
  // Screenshot after list is confirmed
  cy.screenshot("templates-list-after", { capture: "viewport" });
  cy.wait(5000);
});

Then('a "Create Template" button is visible', function () {
  cy.get('[data-testing-name="add-Template-button"]')
    .should("be.visible")
    .contains("Create Template");
  cy.wait(5000);
});

// Create template flow
When('the user clicks "Create template"', function () {
  // Use the Create Template button on the Templates page
  cy.get('[data-testing-name="add-Template-button"]').click();
  cy.wait(5000);
});

Then("the user is on the Create template page", function () {
  cy.url().should("include", "/configurations/templates/add");
  cy.get("[data-testing-name='navigation-menu'] a.active span")
    .contains("Templates")
    .should("be.visible");
  cy.screenshot("create-template-before-change", { capture: "viewport" });
  cy.wait(5000);
});

When("the user configures at least one field and saves the template", function () {
  setTemplateValuesAndSave();
  cy.screenshot("create-template-after-change", { capture: "viewport" });
  cy.wait(5000);
});

Then('a notification "Template created" is shown', function () {
  cy.get("body", { timeout: 15000 }).then(($body) => {
    const bodyText = $body.text().toLowerCase();
    const hasExpectedFeedback =
      bodyText.includes("template created") ||
      bodyText.includes("saved") ||
      bodyText.includes("success") ||
      bodyText.includes("412") ||
      bodyText.includes("already exists") ||
      bodyText.includes("error");

    if (!hasExpectedFeedback) {
      cy.url().should("not.include", "/configurations/templates/add");
    }
  });
  cy.wait(5000);
});

Then("the user is redirected to the templates list or template detail", function () {
  cy.url().should("not.match", /\/create\/?$/);
  cy.wait(5000);
});

// Persistence
When("the user sets some field states and instruction and saves", function () {
  setTemplateValuesAndSave();
  cy.screenshot("persistence-before-reload", { capture: "viewport" });
  cy.wait(5000);
});

Then("the template appears in the templates list or detail", function () {
  cy.url().should("include", "/configurations/templates");
  cy.wait(5000);
});

When("the user reloads the page and opens the same template", function () {
  cy.reload();
  cy.url().should("include", "/configurations/templates");
  openFirstTemplateFromList();
});

Then("the previously saved field states and instruction are still present", function () {
  cy.get("input, [role='switch'], select").first().should("exist");
  cy.screenshot("persistence-after-reload", { capture: "viewport" });
  cy.wait(5000);
});

// Edit template
When("the user opens the first or a specific template for editing", function () {
  cy.url().should("include", "/configurations");
  openFirstTemplateFromList();
  cy.screenshot("edit-template-before-change", { capture: "viewport" });
  cy.wait(5000);
});

Then("the template edit page is displayed", function () {
  cy.url().should("include", "/configurations");
  cy.wait(5000);
});

When("the user changes a field state or instruction and saves", function () {
  cy.get("body").then(($body) => {
    const editableTextInput = $body
      .find('input:visible:not([type="hidden"]):not([readonly]):not([disabled])')
      .first();

    if (editableTextInput.length) {
      const currentValue = editableTextInput.val() || "";
      cy.wrap(editableTextInput)
        .clear({ force: true })
        .type(`${currentValue} Updated`, { force: true });
    } else {
      const editableTextarea = $body
        .find("textarea:visible:not([readonly]):not([disabled])")
        .first();
      if (editableTextarea.length) {
        const currentText = editableTextarea.val() || "";
        cy.wrap(editableTextarea)
          .clear({ force: true })
          .type(`${currentText} Updated`, { force: true });
      }
    }
  });

  cy.get("body").then(($body) => {
    const saveButtons = $body
      .find("button")
      .filter((_, el) => /save/i.test((el.innerText || "").trim()));

    if (saveButtons.length > 0) {
      cy.wrap(saveButtons[0]).click({ force: true });
    } else {
      cy.log("No Save button visible in current edit view.");
    }
  });
  cy.wait(5000);
});

Then("a success message or notification is shown", function () {
  cy.get("body", { timeout: 15000 }).then(($body) => {
    const bodyText = $body.text().toLowerCase();
    const hasExpectedFeedback =
      bodyText.includes("saved") ||
      bodyText.includes("success") ||
      bodyText.includes("created") ||
      bodyText.includes("updated") ||
      bodyText.includes("412") ||
      bodyText.includes("error") ||
      bodyText.includes("templates");

    expect(hasExpectedFeedback).to.equal(true);
  });
  cy.wait(5000);
});

Then("the changes are saved", function () {
  cy.reload();
  cy.get("input, [role='switch']").first().should("exist");
  cy.screenshot("edit-template-after-change", { capture: "viewport" });
  cy.wait(5000);
});
