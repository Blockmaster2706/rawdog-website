# E2E Testing Setup Guide

## Quick Start

### Prerequisites
Make sure your application is running on `http://localhost:5500` before running E2E tests.

### Running E2E Tests

**Interactive Mode (Recommended for Development):**
```bash
npm run test:e2e:open
```

**Headless Mode (CI/CD):**
```bash
npm run test:e2e
```

### Test Files Location
- E2E tests are located in: `cypress/e2e/`
- Current test files:
  - `basic.cy.ts` - Basic page load and structure tests
  - `filesystem.cy.ts` - Tests for your CustomFileSystem functionality

### Configuration
- Base URL: `http://localhost:5500` (configured in `cypress.config.ts`)
- Viewport: 1280x720
- Videos: Disabled (for faster execution)
- Screenshots: Enabled on test failure

### Writing New E2E Tests

Create new test files in `cypress/e2e/` with the `.cy.ts` extension:

```typescript
describe('My New Feature', () => {
  beforeEach(() => {
    cy.visit('/') // This will go to localhost:5500
  })

  it('should test something', () => {
    cy.get('[data-cy="my-element"]').should('be.visible')
    cy.get('[data-cy="my-button"]').click()
    // Add your assertions here
  })
})
```

### Best Practices for E2E Tests

1. **Use data-cy attributes** for element selection:
   ```html
   <button data-cy="submit-button">Submit</button>
   ```

2. **Start each test with cy.visit()**:
   ```typescript
   beforeEach(() => {
     cy.visit('/')
   })
   ```

3. **Test user workflows**, not implementation details

4. **Keep tests independent** - each test should work in isolation

5. **Use descriptive test names** that explain what the user is doing

### Common Cypress Commands

```typescript
// Navigation
cy.visit('/path')
cy.go('back')
cy.reload()

// Element interaction
cy.get('[data-cy="element"]').click()
cy.get('input').type('text')
cy.get('select').select('option')

// Assertions
cy.get('element').should('be.visible')
cy.get('element').should('contain', 'text')
cy.url().should('include', '/path')

// Wait for conditions
cy.get('element').should('exist')
cy.wait(1000) // Use sparingly
```

### Debugging Tips

1. **Use .pause()** to pause test execution:
   ```typescript
   cy.get('button').click()
   cy.pause() // Test will pause here
   ```

2. **Use .debug()** to inspect elements:
   ```typescript
   cy.get('element').debug()
   ```

3. **Check the browser console** for JavaScript errors

4. **Use cy.screenshot()** to capture specific moments:
   ```typescript
   cy.screenshot('my-test-state')
   ```

### Example Test Patterns

**Testing Forms:**
```typescript
it('should submit contact form', () => {
  cy.get('[data-cy="name"]').type('John Doe')
  cy.get('[data-cy="email"]').type('john@example.com')
  cy.get('[data-cy="submit"]').click()
  cy.get('[data-cy="success"]').should('be.visible')
})
```

**Testing Navigation:**
```typescript
it('should navigate to about page', () => {
  cy.get('[data-cy="about-link"]').click()
  cy.url().should('include', '/about')
  cy.get('h1').should('contain', 'About Us')
})
```

**Testing API Responses:**
```typescript
it('should load data from API', () => {
  cy.intercept('GET', '/api/users', { fixture: 'users.json' })
  cy.visit('/users')
  cy.get('[data-cy="user-list"]').should('be.visible')
})
```