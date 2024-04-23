import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { userModel, zodUserSchema } from '../../models/UserModel'


export const createUser = async (req: Request, res: Response) => {
  const userData = zodUserSchema.omit({
    _id: true
  }).parse(req.body)
  const existsUserWithEmail = await userModel.findOne({
    email: userData.email
  })

  if (existsUserWithEmail) {
    return res.status(400).json({
      error: 'Already exists a user with this email'
    })
  }
  const existsUserWithCpf = await userModel.findOne({
    cpf: userData.cpf
  })
  if (existsUserWithCpf) {
    return res.status(400).json({
      error: 'Already exists a user with this cpf'
    })
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const newUser = await userModel.create({
    ...userData,
    password: hashedPassword
  })

  return res.status(201).json(newUser)
}