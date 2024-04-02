import { Schema, Types, model } from 'mongoose'
import { z } from 'zod'

export const zodAddressSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  cep: z.string(),
  street: z.string(),
  num: z.string(),
  city: z.string(),
  uf: z.string(),
})

export type Address = z.infer<typeof zodAddressSchema>

const AddressSchema = new Schema({
  cep: {type: String, required: true},
  street: {type: String, required: true},
  num: {type: String, required: true},
  city: {type: String, required: true},
  uf: {type: String, required: true},
})

export const addressModel = model('Address', AddressSchema)
