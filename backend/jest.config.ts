import type { Config } from '@jest/types'
import './src/configs/server'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
}

export default config