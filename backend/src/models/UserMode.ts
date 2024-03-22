import { Document, Schema, Types, model } from 'mongoose'
import { z } from 'zod'
import { zodAddressSchema } from './AddressModel'
import { zodHealthInfoSchema } from './HealthInfo'

export const zodUserSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  gender: z.string(),
  password: z.string(),
  email: z.string(),
  cpf: z.string(),
  data_nascimento: z.date(),
  address: zodAddressSchema,
  healthInfo: z.object(zodHealthInfoSchema.shape).optional(),
  createdAt: z.date(),
})

export type User = z.infer<typeof zodUserSchema>

const UserSchema = new Schema({
  name: {
    type: String
    ,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  data_nascimento: {
    type: Date,
    required: true
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  healthInfo: {
    type: Schema.Types.ObjectId,
    ref: 'HealthInfo',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const userModel = model('User', UserSchema)
