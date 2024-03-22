import { Schema, model } from 'mongoose'

const AddressSchema = new Schema({
  cep: String,
  street: String,
  num: String,
  city: String,
  uf: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const addressModel = model('Address', AddressSchema)
