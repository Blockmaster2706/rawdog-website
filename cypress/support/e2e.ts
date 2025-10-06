// ***********************************************
// This example support/e2e.ts is processed and
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
// ***********************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './types'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add any global E2E configuration here
// For example, you can add custom commands, set up before/after hooks, etc.

// Example: Add a global beforeEach hook
// beforeEach(() => {
//   // This will run before each test
//   cy.log('Starting new test')
// })

// Example: Add global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // you might want to be more specific about which errors to ignore
  return false
})