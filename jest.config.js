module.exports = {
  verbose: true,
  preset: 'ts-jest',
  rootDir: '.',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
}
