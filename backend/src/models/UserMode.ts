import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  lastName: String,
  gender: String,
  password: String,
  email: {
    type: String,
    unique: true
  },
  cpf: {
    type: String,
    unique: true
  },
  data_nascimento: Date,
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
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