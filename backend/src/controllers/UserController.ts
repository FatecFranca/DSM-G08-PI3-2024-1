import { Request, Response } from 'express'
import { userModel } from '../models/UserMode'

export const userController = {
  async create(req: Request, res: Response) {
    const body = req.body
    console.log(body)
    const createdUser = await userModel.create(body)

    return res.status(201).json(createdUser)
  },
}