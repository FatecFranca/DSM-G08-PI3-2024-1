import { Request, Response } from 'express'
import { userModel } from '../../models/UserModel'
import { AppError } from '../../errors/AppError'

export const deleteUser = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Payload should be on request')
  }
  const { id } = req.params
  if (payload.id !== id) {
    throw AppError.forbidden('You are not allowed to delete the resource')
  }
  
  await userModel.deleteOne({ _id: id })
  res.status(200).json({ message: 'User deleted successfully' })
}