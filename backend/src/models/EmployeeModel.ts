import mongoose from 'mongoose'
import { z } from 'zod'
import { RoleEnum } from '../types/RoleEnum'

export const zodEmployeeSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId).optional(),
  user: z.instanceof(mongoose.Types.ObjectId),
  role: z.nativeEnum(RoleEnum)
})

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    default: RoleEnum.EMPLOYEE
  },
})

export const employeeModel = mongoose.model('Employee', EmployeeSchema)