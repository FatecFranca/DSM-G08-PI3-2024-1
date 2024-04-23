import { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'
import { userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'

export const getUserById = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Payload not found')
  }
  const isNotEmployee = ![RoleEnum.ADMIN, RoleEnum.EMPLOYEE].includes(payload.role)
  if (isNotEmployee && payload.id !== req.params.id) {
    throw AppError.forbidden('You are not allowed to access this resource')
  }
  
  const { id } = req.params

  const user = await userModel.findById(id)
  if (!user) {
    throw new NotFoundError('User not found', {id})
  }

  return res.json(user)
}