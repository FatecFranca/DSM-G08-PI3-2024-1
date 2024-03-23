import { env } from '../configs/env'
import mongoose from 'mongoose'

beforeAll(async () => {
  console.log(env)
  return mongoose.connect(env.DATABASE_URL)
})

afterAll(async () => {
  console.log('Closing connection...')
  return mongoose.disconnect()
})