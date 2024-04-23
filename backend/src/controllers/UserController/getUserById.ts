import { Request, Response } from 'express'
import { userModel } from '../../models/UserModel'
import { NotFoundError } from '../../errors/NotFoundError'

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await userModel.findById(id)
  if (!user) {
    throw new NotFoundError('User not found', {id})
  }

  return res.json(user)
}