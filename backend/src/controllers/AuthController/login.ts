import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../../configs/env'
import { userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'
import { NotFoundError } from '../../errors/NotFoundError'
import { AppError } from '../../errors/AppError'

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginBodySchema.parse(req.body)

  const user = await userModel.findOne({
    email
  })

  if (!user) {
    throw new NotFoundError('User not found', { email })
  }

  const isValidPassword = bcrypt.compareSync(password, user.password)
  if (!isValidPassword) {
    throw AppError.unauthorized('Invalid password')
  }
  
  const token = await jwt.sign({ id: user._id, role: RoleEnum.USER, name: user.name }, env.JWT_SECRET, { expiresIn: '1d' })

  return res.status(200).json({
    token,
    user
  })
}
