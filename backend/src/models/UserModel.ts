import { Schema, Types, model } from 'mongoose'
import { z } from 'zod'
import { isValid } from '@fnando/cpf'

export const zodAddressSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  cep: z.string(),
  street: z.string(),
  num: z.string(),
  city: z.string(),
  uf: z.string(),
})

export const zodUserSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  name: z.string(),
  lastName: z.string(),
  gender: z.string(),
  password: z.string(),
  email: z.string().email(),
  cpf: z.string().refine((cpf) => {
    return isValid(cpf)
  }, { message: 'Invalid CPF' }),
  data_nascimento: z.coerce.date(),
  address: zodAddressSchema,
  healthInfo: z.object({
    cardiorespiratoryDisease: z.string().optional(),
    surgery: z.string().optional(),
    allergy: z.string().optional(),
    preExistingCondition: z.string().optional(),
    medicineInUse: z.string().optional(),
  }).optional()
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
    type: {
      cep: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      num: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      uf: {
        type: String,
        required: true
      },
    },
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
  }
})

export const userModel = model('User', UserSchema)
