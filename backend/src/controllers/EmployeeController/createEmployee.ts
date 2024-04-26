import { Request, Response } from 'express'
import { z } from 'zod'
import { employeeModel } from '../../models/EmployeeModel'
import { RoleEnum } from '../../types/RoleEnum'
import mongoose, { Types } from 'mongoose'
import { userModel } from '../../models/UserModel'
import { NotFoundError } from '../../errors/NotFoundError'
import { AppError } from '../../errors/AppError'


const zodCreateEmployeeBodySchema = z.object({
  userId: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid user id' }),
  role: z.union([z.literal(RoleEnum.ADMIN), z.literal(RoleEnum.EMPLOYEE)])
})

export const createEmployee = async (req: Request, res: Response) => {
  const { userId, role } = zodCreateEmployeeBodySchema.parse(req.body)
  if (role === RoleEnum.ADMIN) {
    const existAdmin = await employeeModel.findOne({ role: RoleEnum.ADMIN })
    if (existAdmin) {
      throw AppError.forbidden('Admin already exists')
    }
  }

  const existUser = await userModel.findById(userId)
  if (!existUser) {
    throw new NotFoundError('User not found', { userId })
  }

  const employee = await employeeModel.create({ user: userId, role })

  return res.status(201).json(employee)
}