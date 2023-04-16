import type { Config } from '@jest/types'

export default {
  verbose: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
} satisfies Config.InitialOptions
