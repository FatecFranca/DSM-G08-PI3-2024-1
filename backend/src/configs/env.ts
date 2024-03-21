import dotenv from 'dotenv'
dotenv.config()
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('8080'),
})

export const env = envSchema.parse(process.env)
