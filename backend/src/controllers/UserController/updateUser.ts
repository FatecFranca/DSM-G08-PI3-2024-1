import { Request, Response } from 'express'
import { DuplicatedIndexError } from '../../errors/DuplicatedIndexError'
import { NotFoundError } from '../../errors/NotFoundError'
import { userModel, zodUserSchema } from '../../models/UserModel'
import { z } from 'zod'
import { AppError } from '../../errors/AppError'

export const updateUser = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Payload not found in request')
  }

  if (payload.id !== req.params.id) {
    throw AppError.forbidden('You can only update your own user')
  }
  
  const { id } = req.params
  const userData = zodUserSchema.partial().extend({
    _id: z.undefined(),
    password: z.undefined(),
    email: z.undefined(),
  }).parse(req.body)

  const savedUser = await userModel.findById(id)
  if (!savedUser) {
    throw new NotFoundError('User not found', { id })
  }

  const isCpfDifferent = userData.cpf && (savedUser.cpf !== userData.cpf)
  if (isCpfDifferent) {
    const existsUserWithCpf = await userModel.findOne({
      cpf: userData.cpf
    })
    if (existsUserWithCpf) {
      throw DuplicatedIndexError.fromDuplicatedIndexesOfEntity({ cpf: userData.cpf as string }, 'User')
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