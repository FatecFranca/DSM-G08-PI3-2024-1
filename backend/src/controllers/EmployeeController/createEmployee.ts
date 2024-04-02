import { Request, Response } from 'express'
import { z } from 'zod'
import { employeeModel } from '../../models/EmployeeModel'
import { RoleEnum } from '../../types/RoleEnum'
import mongoose, { Types } from 'mongoose'
import { userModel } from '../../models/UserModel'


const zodCreateEmployeeBodySchema = z.object({
  userId: z.string().refine(Types.ObjectId.isValid, { message: 'Invalid user id' }),
  role: z.nativeEnum(RoleEnum)
})

export const createEmployee = async (req: Request, res: Response) => {
  const { userId, role } = zodCreateEmployeeBodySchema.parse(req.body)
  if (role === RoleEnum.ADMIN) {
    const existAdmin = await employeeModel.findOne({ role: RoleEnum.ADMIN })
    if (existAdmin) {
      return res.status(403).json({ message: 'Admin already exists' })
    }
  }

  const existUser = await userModel.findById(userId)
  if (!existUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  const employee = await employeeModel.create({ user: userId, role })

  return res.status(201).json(employee)
}