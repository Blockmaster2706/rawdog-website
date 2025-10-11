"use strict";
describe("Basic E2E Tests for localhost:5500", () => {
    beforeEach(() => {
        // Visit your localhost application before each test
        cy.visit("http://localhost:5500/dist/index.html");
    });
    it("should load the terminal page successfully", () => {
        // Check that the page loads without errors
        cy.url().should("include", "localhost:5500/dist/index.html");
    });
    it("should have basic page structure", () => {
        // Check for basic HTML elements
        cy.get("body").should("exist");
        cy.get("head").should("exist");
        cy.contains("p", "/bin/bash"); // Adjust based on your actual content
    });
    it("should display terminal prompt", () => {
        // Check for the presence of the terminal prompt
        cy.get(".prompt").should("exist");
        cy.get(".prompt").should("contain.text", "user@machine:~$"); // Adjust based on your prompt format
    });
    it("should allow typing in the terminal input", () => {
        const command = "ls -la";
        cy.get(".command-input").type(command);
        cy.get(".command-input").should("have.value", command);
    });
    it("should allow path completion with Tab key", () => {
        const partialCommand = "cd doc";
        cy.get(".command-input").type("mkdir documents"); // Create a directory first
        cy.get(".command-input").press(Cypress.Keyboard.Keys.ENTER);
        cy.get(".command-input").type(partialCommand);
        cy.get(".command-input").press(Cypress.Keyboard.Keys.TAB);
        cy.get(".command-input").should("have.value", "cd /documents/"); // Adjust based on your actual directory structure
    });
    it("should execute command on Enter key press", () => {
        const command = "help";
        cy.get(".command-input").type(command);
        cy.get(".command-input").type("{enter}");
        cy.get(".command-input").should("have.value", "");
        cy.get(".current-command").should("contain.text", command); // Adjust based on how executed commands are displayed
    });
});
//# sourceMappingURL=terminal.cy.js.map