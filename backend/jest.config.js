module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
