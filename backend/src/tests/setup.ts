import { env } from '../configs/env'
import mongoose from 'mongoose'
import { addressModel } from '../models/AddressModel'
import { userModel } from '../models/UserMode'

beforeAll(async () => {
  await mongoose.connect(env.DATABASE_URL)
  await userModel.deleteMany({})
  await addressModel.deleteMany({})
})

afterAll(async () => {
  await userModel.deleteMany({})
  await addressModel.deleteMany({})
  await mongoose.disconnect()
})