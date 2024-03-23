import dotenv from 'dotenv'
import { z } from 'zod'

const environment = process.env.NODE_ENV || 'dev'
if (environment === 'dev') {
  dotenv.config({
    path: '.env',
  })
} else if (environment === 'test') {
  dotenv.config({
    path: '.env.test',
  })
} else {
  throw Error('Environment not supported')
}

const ENVZodType = environment === 'dev'? z.literal('dev') : z.literal('test')
export const envSchema = z.object({
  PORT: z.string().default('8080'),
  DATABASE_URL: z.string(),
  ENV: ENVZodType,
})

export const env = envSchema.parse(process.env)
