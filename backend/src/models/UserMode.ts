import { Schema, Types, model } from 'mongoose'
import { z } from 'zod'
import { zodAddressSchema } from './AddressModel'

export const zodUserSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  name: z.string(),
  lastName: z.string(),
  gender: z.string(),
  password: z.string(),
  email: z.string(),
  cpf: z.string(),
  data_nascimento: z.date(),
  address: zodAddressSchema,
  healthInfo: z.object({
    cardiorespiratoryDisease: z.string().optional(),
    surgery: z.string().optional(),
    allergy: z.string().optional(),
    preExistingCondition: z.string().optional(),
    medicineInUse: z.string().optional(),
  }).optional(),
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
    type: {
      cardiorespiratoryDisease: {
        type: String,
        required: false
      },
      surgery: {
        type: String,
        required: false
      },
      allergy: {
        type: String,
        required: false
      },
      preExistingCondition: {
        type: String,
        required: false
      },
      medicineInUse: {
        type: String,
        required: false
      },
    },
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const userModel = model('User', UserSchema)
