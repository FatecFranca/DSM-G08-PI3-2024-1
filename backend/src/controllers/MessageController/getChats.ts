import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'

export const getChats = async (req: Request, res: Response) => {
  const chats = await chatModel.find({ attedant: null })

  return res.status(200).json(chats)
}