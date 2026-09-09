import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:49432',
    specPattern: 'test/e2e/**/*.cy.ts',
    supportFile: false,
    fixturesFolder: false,
    video: false,
    screenshotOnRunFailure: false,
  },
})
