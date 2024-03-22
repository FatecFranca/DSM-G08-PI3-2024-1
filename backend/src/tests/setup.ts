import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({
  path: '.env.test'
})

import { env } from '../configs/env'

beforeAll(async () => {
  return mongoose.connect(env.DATABASE_URL)
})

afterAll(async () => {
  await mongoose.disconnect()
})
