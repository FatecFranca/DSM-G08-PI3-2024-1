import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'

export const getChatsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId

  const chats = await chatModel.find({ patient: userId })

  return res.status(200).json(chats)
}