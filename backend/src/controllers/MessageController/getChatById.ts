import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'

export const getChatById = async (req: Request, res: Response) => {
  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' })
  }

  return res.status(200).json(chat)
}