import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'

//TODO: Implement query search to find chats without attendant
export const getChats = async (req: Request, res: Response) => {
  const chats = await chatModel.find().populate('patient')

  return res.status(200).json(chats)
}