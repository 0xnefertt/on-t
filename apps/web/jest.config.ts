import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@on-t/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
};

export default createJestConfig(config);
