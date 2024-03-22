import { Schema, model, HydratedDocument } from 'mongoose'
import { z } from 'zod'

export const zodAddressSchema = z.object({
  cep: z.string(),
  street: z.string(),
  num: z.string(),
  city: z.string(),
  uf: z.string(),
  createdAt: z.date(),
})

export type Address = z.infer<typeof zodAddressSchema>

const AddressSchema = new Schema({
  cep: {type: String, required: true},
  street: {type: String, required: true},
  num: {type: String, required: true},
  city: {type: String, required: true},
  uf: {type: String, required: true},
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const addressModel = model('Address', AddressSchema)
