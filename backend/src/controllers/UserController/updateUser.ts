import { Request, Response } from 'express'
import { userModel, zodUserSchema } from '../../models/UserModel'

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const userData = zodUserSchema.omit({
    _id: true,
    password: true,
    email: true,
  }).partial().parse(req.body)

  const savedUser = await userModel.findById(id)
  if (!savedUser) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  const isCpfDifferent = userData.cpf && (savedUser.cpf !== userData.cpf)
  if (isCpfDifferent) {
    const existsUserWithCpf = await userModel.findOne({
      cpf: userData.cpf
    })
    if (existsUserWithCpf) {
      return res.status(400).json({
        error: 'Already exists a user with this cpf'
      })
    }
  }

  await userModel.updateOne({
    _id: id
  }, {
    ...userData
  })

  const updatedUser = await userModel.findById(id)

  return res.status(200).json(updatedUser)
}