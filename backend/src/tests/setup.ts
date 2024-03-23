import dotenv from 'dotenv'
import { env } from '../configs/env'
import mongoose from 'mongoose'

dotenv.config({
  path: '.env.test'
})

beforeAll(async () => {
  console.log(`Connecting to database: ${env.DATABASE_URL}`)
  return mongoose.connect(env.DATABASE_URL)
})

afterAll(async () => {
  console.log('Closing connection...')
  return mongoose.disconnect()
})