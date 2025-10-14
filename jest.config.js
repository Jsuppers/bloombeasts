export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [2339, 18048, 2532, 2531],
      },
    }],
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'bloombeasts/engine/**/*.ts',
    '!bloombeasts/engine/**/*.d.ts',
    '!bloombeasts/engine/**/index.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/bloombeasts'],
};
