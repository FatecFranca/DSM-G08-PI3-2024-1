import mongoose from 'mongoose'
import { env } from '../configs/env'

beforeAll(async () => {
  await mongoose.connect(env.DATABASE_URL)
})

afterAll(async () => {
  await mongoose.disconnect()
})