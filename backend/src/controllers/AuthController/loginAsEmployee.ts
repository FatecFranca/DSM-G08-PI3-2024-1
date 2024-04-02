import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { z } from 'zod'
import { employeeModel } from '../../models/EmployeeModel'
import { userModel } from '../../models/UserModel'
import { env } from '../../configs/env'

const zodBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginAsEmployee = async (req: Request, res: Response) => {
  const { email, password } = zodBodySchema.parse(req.body)

  const user = await userModel.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(403).json({ message: 'Invalid credentials' })
  }

  const isEmployee = await employeeModel.findOne({ user: user._id })
  if (!isEmployee) {
    return res.status(403).json({ message: 'User is not an employee' })
  }

  const token = jwt.sign({ id: user._id, role: isEmployee.role }, env.JWT_SECRET, { expiresIn: '1d' })
  
  return res.status(200).json({
    employee: {
      employeeId: isEmployee._id,
      role: isEmployee.role,
      ...user.toJSON()
    },
    token
  })
}