import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { userModel, zodUserSchema } from '../../models/UserModel'
import { DuplicatedIndexError } from '../../errors/DuplicatedIndexError'


export const createUser = async (req: Request, res: Response) => {
  const body = req.body
  
  const userData = zodUserSchema.omit({
    _id: true
  }).parse(req.body)

  const existsUserWithEmail = !!(await userModel.findOne({
    email: userData.email
  }))
  const existsUserWithCpf = !!(await userModel.findOne({
    cpf: userData.cpf
  }))

  if (existsUserWithEmail || existsUserWithCpf) {
    const duplicatedIndexes: Record<string, string|number> = {
      ...(existsUserWithEmail && { email: userData.email }),
      ...(existsUserWithCpf && { cpf: userData.cpf })
    }

    throw DuplicatedIndexError.fromDuplicatedIndexesOfEntity(duplicatedIndexes, 'User')
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const newUser = await userModel.create({
    ...userData,
    password: hashedPassword
  })

  return res.status(201).json(newUser)
}