import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'

export const getChatsByAttendant = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const attendantId = req.params.attendantId

  const chats = await chatModel.find({ attendant: attendantId })

  const isNotAdmin = payload.role !== RoleEnum.ADMIN
  const isNotAuthorized = payload.id !== attendantId

  if (isNotAdmin && isNotAuthorized) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
  return res.status(200).json(chats)
}