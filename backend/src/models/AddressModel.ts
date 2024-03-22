import { Schema, model } from 'mongoose'

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
