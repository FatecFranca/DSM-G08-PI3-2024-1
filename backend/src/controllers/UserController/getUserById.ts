import { Request, Response } from 'express'
import { userModel } from '../../models/UserModel'

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await userModel.findById(id)
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  return res.json(user)
}