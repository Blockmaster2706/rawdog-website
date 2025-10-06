# Unit Testing Setup with Cypress Component Testing

This project demonstrates how to set up unit testing for TypeScript classes using Cypress Component Testing in a vanilla HTML/CSS/TypeScript project.

## Project Structure

```
rawdog-website/
├── src/
│   ├── types.ts              # CustomFileSystem class
│   ├── math-utils.ts         # MathUtils class for demo
│   ├── terminal.ts           # Terminal functionality
│   └── ...
├── cypress/
│   ├── component/
│   │   ├── CustomFileSystem.cy.ts  # Unit tests for CustomFileSystem
│   │   ├── MathUtils.cy.ts         # Unit tests for MathUtils
│   │   └── Terminal.cy.ts          # Unit tests for Terminal functions
│   ├── support/
│   │   ├── component.ts      # Cypress component support file
│   │   └── commands.ts       # Custom Cypress commands
│   └── tsconfig.json         # TypeScript config for Cypress
├── cypress.config.ts         # Cypress configuration
├── vite.config.ts           # Vite configuration for bundling
├── package.json             # NPM scripts and dependencies
└── tsconfig.json            # Main TypeScript configuration
```

## Installation and Setup

1. **Dependencies are already installed:**
   - `cypress` - Testing framework
   - `typescript` - TypeScript compiler
   - `vite` - Bundler for component testing

2. **Configuration files are set up:**
   - `cypress.config.ts` - Configures Cypress for component testing
   - `cypress/tsconfig.json` - TypeScript config for test files
   - `vite.config.ts` - Vite bundler configuration

## Running Tests

### Interactive Testing (Recommended for Development)
```bash
npm run test:open
```
This opens the Cypress Test Runner where you can:
- See all test files
- Run individual test suites
- Watch tests run in real-time
- Debug failing tests

### Headless Testing (CI/CD)
```bash
npm run test
```
Runs all component tests in headless mode.

### All Cypress Options
```bash
npm run cypress:open    # Opens Cypress (E2E and Component options)
npm run cypress:run     # Runs all Cypress tests headlessly
```

## Test Files Overview

### 1. CustomFileSystem.cy.ts
Comprehensive unit tests for the `CustomFileSystem` class including:
- Constructor and initial state
- Path navigation (`getNodeByPath`)
- Node type detection (`getNodeType`)
- File reading (`readFile`)
- Directory listing (`listDirectory`)
- Directory changing (`changeDirectory`)
- Integration tests with complex file structures

### 2. MathUtils.cy.ts
Complete unit tests for the `MathUtils` class demonstrating:
- Basic arithmetic operations (add, subtract, multiply, divide)
- Advanced operations (power, square root)
- History management and tracking
- Chained calculations using fluent interface
- Error handling (division by zero, negative square roots)
- Edge cases (large numbers, precision)

### 3. Terminal.cy.ts
Tests for terminal-related business logic:
- Command parsing and validation
- Path processing utilities
- Input handling logic
- String manipulation functions

## Key Testing Patterns

### 1. Test Isolation
```typescript
beforeEach(() => {
  // Fresh instance for each test
  fileSystem = new CustomFileSystem();
});
```

### 2. Comprehensive Assertions
```typescript
it('should find nested files', () => {
  const nestedFile = fileSystem.getNodeByPath('~/documents/file1.txt');
  
  expect(nestedFile).to.exist;
  expect(nestedFile!.name).to.equal('file1.txt');
  expect(nestedFile!.type).to.equal('file');
  expect(nestedFile!.content).to.equal('Content of file1');
});
```

### 3. Error Testing
```typescript
it('should throw error when dividing by zero', () => {
  expect(() => mathUtils.divide(10, 0))
    .to.throw('Division by zero is not allowed');
});
```

### 4. Edge Case Testing
```typescript
it('should handle very large numbers', () => {
  const result = mathUtils.add(Number.MAX_SAFE_INTEGER - 1, 1);
  expect(result).to.equal(Number.MAX_SAFE_INTEGER);
});
```

## Best Practices Demonstrated

1. **Separation of Concerns**: Business logic is tested separately from DOM manipulation
2. **Test Organization**: Tests are grouped by functionality using `describe` blocks
3. **Clear Test Names**: Each test clearly states what it's testing
4. **Setup and Teardown**: Using `beforeEach` for test isolation
5. **Comprehensive Coverage**: Testing happy paths, edge cases, and error conditions
6. **Assertion Variety**: Using different types of assertions (equality, existence, throws, etc.)

## Extending the Tests

To add tests for new classes:

1. Create your TypeScript class in the `src/` directory
2. Create a corresponding test file in `cypress/component/` with the `.cy.ts` extension
3. Import your class and write tests following the patterns shown
4. Run the tests using `npm run test:open`

## Notes

- **Pure Unit Testing**: These tests focus on class methods and business logic without DOM dependencies
- **Fast Execution**: Tests run quickly since they don't involve browser rendering
- **TypeScript Support**: Full TypeScript support with proper type checking
- **Rich Assertions**: Cypress includes Chai assertions for comprehensive testing
- **Great Developer Experience**: Interactive test runner with real-time feedback

## Troubleshooting

If you encounter issues:

1. **TypeScript Errors**: Check that all imports are correct and classes are exported
2. **Test Not Found**: Ensure test files end with `.cy.ts` and are in the `cypress/component/` directory
3. **Import Issues**: Verify the relative paths in import statements
4. **Configuration Issues**: Check `cypress.config.ts` and `tsconfig.json` files

This setup provides a robust foundation for unit testing TypeScript classes using Cypress Component Testing!