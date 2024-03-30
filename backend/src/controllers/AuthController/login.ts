import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../../configs/env'
import { userModel } from '../../models/UserModel'

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
    return res.status(404).json({
      message: 'User not found'
    })
  }

  const isValidPassword = bcrypt.compareSync(password, user.password)
  if (!isValidPassword) {
    return res.status(401).json({
      message: 'Invalid password'
    })
  }
  
  const token = await jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '1d' })

  return res.status(200).json({
    token
  })
}
