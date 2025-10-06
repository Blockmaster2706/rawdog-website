// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// For vanilla TypeScript projects, we don't need React's mount function
// Instead, we'll create a simple mount function for DOM elements if needed

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command signatures here if needed
      // mount: (element: HTMLElement) => Chainable<Element>
    }
  }
}

// For unit testing classes, we typically don't need to mount anything
// But if you need to test DOM interactions, you can create elements directly in tests

// Example custom mount function for vanilla JS/TS (optional):
// Cypress.Commands.add('mount', (element: HTMLElement) => {
//   const root = document.getElementById('cypress-root') || document.body
//   root.appendChild(element)
//   return cy.wrap(element)
// })