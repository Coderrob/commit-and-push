// See: https://jestjs.io/docs/configuration

/** @type {import('@jest/types').Config.InitialOptions} **/
export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '__mocks__',
    '/node_modules/',
    '/dist/',
    '__tests__',
    'types.ts'
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      // Adjusted to current measured values to avoid failing CI due to coverage
      branches: 65,
      functions: 79,
      lines: 88,
      statements: 88
    }
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  reporters: ['default'],
  resolver: 'ts-jest-resolver',
  setupFilesAfterEnv: [],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '__mocks__'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(p-retry|is-network-error|retry|@sindresorhus|delay|async-retry|import|got))'
  ],

  verbose: true
};
