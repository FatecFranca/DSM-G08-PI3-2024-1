import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'

export const getChatById = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' })
  }


  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' })
  }
  const isNotAdmin = payload.role !== RoleEnum.ADMIN
  const isNotAuthorized = ![chat.patient, chat.attendant].includes(payload.id as any)

  if (isNotAdmin && isNotAuthorized) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.status(200).json(chat)
}