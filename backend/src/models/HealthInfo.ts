import { Schema, model } from 'mongoose'

const HealthInfoSchema = new Schema({
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
})

export const healthInfoModel = model('HealthInfo', HealthInfoSchema)