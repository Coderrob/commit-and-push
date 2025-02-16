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
    'src/schema/'
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 35, // 85 coverage required
      functions: 81, // 85 coverage required
      lines: 80, // 85 coverage required
      statements: 78 // 85 coverage required
    }
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  reporters: ['default'],
  resolver: 'ts-jest-resolver',
  setupFilesAfterEnv: [
    '<rootDir>/tsconfig.json',
    '<rootDir>/tsconfig.eslint.json'
  ],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '__mocks__'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.eslint.json',
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!@jest/)',
    '.*\\.(spec|test)\\.(js|jsx)$'
  ],
  verbose: true
};
