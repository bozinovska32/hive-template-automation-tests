# Template Management - Production Portal
# Covers acceptance criteria from requirements: access Templates, create/edit template, notification, persistence

Feature: Template Management in Production Portal
  As an administrator
  I want to manage templates in Configuration Settings
  So that production form fields can be controlled per template

  Background:
    Given the user is logged in to the Production Portal
    And the user navigates to Configuration Settings

  @smoke @templates
  Scenario: User can access the Templates tab
    When the user opens the Templates tab
    Then the Templates tab is displayed
    And a list or table of templates is visible
    And a "Create Template" button is visible

  @smoke @templates @create
  Scenario: User can create a template and see success notification
    When the user opens the Templates tab
    And the user clicks "Create template"
    Then the user is on the Create template page
    When the user configures at least one field and saves the template
    Then a notification "Template created" is shown
    And the user is redirected to the templates list or template detail

  @templates @create @persistence
  Scenario: Created template settings persist after save
    When the user opens the Templates tab
    And the user clicks "Create template"
    And the user sets some field states and instruction and saves
    Then the template appears in the templates list or detail
    When the user reloads the page and opens the same template
    Then the previously saved field states and instruction are still present

  @templates @edit
  Scenario: User can edit an existing template
    When the user opens the Templates tab
    And the user opens the first or a specific template for editing
    Then the template edit page is displayed
    When the user changes a field state or instruction and saves
    Then a success message or notification is shown
    And the changes are saved
