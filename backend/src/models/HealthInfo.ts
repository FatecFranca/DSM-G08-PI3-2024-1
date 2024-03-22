import { Schema, model } from 'mongoose'
import { z } from 'zod'

export const zodHealthInfoSchema = z.object({
  cardiorespiratoryDisease: z.string().optional(),
  surgery: z.string().optional(),
  allergy: z.string().optional(),
  preExistingCondition: z.string().optional(),
  medicineInUse: z.string().optional(),

})

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