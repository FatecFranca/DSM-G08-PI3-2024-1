import { Request, Response } from 'express'
import { userModel } from '../../models/UserMode'

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  await userModel.deleteOne({ _id: id })
  res.status(200).json({ message: 'User deleted successfully' })
}