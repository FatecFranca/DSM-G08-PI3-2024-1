import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'

export const getChatsByAttendant = async (req: Request, res: Response) => {
  const attendantId = req.params.attendantId

  const chats = await chatModel.find({ attendant: attendantId })

  return res.status(200).json(chats)
}