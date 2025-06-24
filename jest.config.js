module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/test-setup.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^lit$': '<rootDir>/src/__tests__/__mocks__/lit.js',
    '^lit/(.*)$': '<rootDir>/src/__tests__/__mocks__/lit.js'
  },
  roots: ['<rootDir>/src', '<rootDir>'],
  modulePaths: ['<rootDir>'],
  transformIgnorePatterns: [
    'node_modules/(?!(lit|@lit)/)'
  ],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
}; 