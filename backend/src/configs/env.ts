import dotenv from 'dotenv'
import { z } from 'zod'

if (!process.env?.ENV || process.env.ENV === 'dev') {
  dotenv.config()
  process.env.ENV
} else if (process.env.ENV !== 'test'){
  throw Error('Environment not supported')
}

export const envSchema = z.object({
  PORT: z.string().default('8080'),
  DATABASE_URL: z.string(),
  ENV: z.string()
})

export const env = envSchema.parse(process.env)
