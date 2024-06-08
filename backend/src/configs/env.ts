import dotenv from 'dotenv'
import { string, z } from 'zod'
//TODO: Create variable to create admin user with default password and email. OPTIONAL
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
  JWT_SECRET: z.string(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: string().min(8)
})

export const env = envSchema.parse(process.env)
