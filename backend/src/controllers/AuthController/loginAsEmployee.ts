import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { z } from 'zod'
import { employeeModel } from '../../models/EmployeeModel'
import { userModel } from '../../models/UserModel'
import { env } from '../../configs/env'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'

const zodBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginAsEmployee = async (req: Request, res: Response) => {
  const { email, password } = zodBodySchema.parse(req.body)

  const user = await userModel.findOne({ email })
  if (!user) {
    throw new NotFoundError('Employee not found', { email })
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid password')
  }

  const isEmployee = await employeeModel.findOne({ user: user._id })
  if (!isEmployee) {
    throw new NotFoundError('Employee not found', { email })
  }
  const payload = {
    id: isEmployee._id,
    role: isEmployee.role,
    name: user.name
  }

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' })
  

  const decodedPayload = jwt.verify(token, env.JWT_SECRET)

  return res.status(200).json({
    employee: {
      employeeId: isEmployee._id,
      role: isEmployee.role,
      user: user.toJSON()
    },
    token
  })
}