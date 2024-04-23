import mongoose from 'mongoose'
import { env } from '../configs/env'
import { userModel } from '../models/UserModel'

beforeAll(async () => {
  await mongoose.connect(env.DATABASE_URL)
  await userModel.deleteMany({})
})

afterAll(async () => {
  await userModel.deleteMany({})
  await mongoose.disconnect()
})