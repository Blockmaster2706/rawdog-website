// Type declarations for Cypress E2E tests

import { CustomFileSystem } from '../../src/types'

declare global {
  interface Window {
    CustomFileSystem: typeof CustomFileSystem
    testFS: CustomFileSystem
  }
}

export {}