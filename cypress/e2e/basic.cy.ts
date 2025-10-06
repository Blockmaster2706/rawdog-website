describe('Basic E2E Tests for localhost:5500', () => {
  beforeEach(() => {
    // Visit your localhost application before each test
    cy.visit('http://localhost:5500/dist/')
  })

  it('should load the homepage successfully', () => {
    // Check that the page loads without errors
    cy.url().should('include', 'localhost:5500')
  })

  it('should have basic page structure', () => {
    // Check for basic HTML elements
    cy.get('body').should('exist')
    cy.get('head').should('exist')

    cy.contains('p', 'Hello world') // Adjust based on your actual content
  })
})