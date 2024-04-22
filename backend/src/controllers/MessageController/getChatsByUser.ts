import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'

export const getChatsByUser = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = req.params.userId

  const chats = await chatModel.find({ patient: userId })

  const isEmployee = payload.role !== RoleEnum.USER
  const isNotAuthorized = payload.id !== userId
  if (isEmployee && isNotAuthorized) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.status(200).json(chats)
}