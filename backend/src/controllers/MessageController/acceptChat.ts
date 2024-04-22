import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'

const zodAcceptChatSchema = z.object({
  attendant: z.instanceof(Types.ObjectId),
})
//TODO: get attendant from token
export const acceptChat = async (req: Request, res: Response) => {
  const { attendant } = zodAcceptChatSchema.parse(req.body)
  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' })
  }

  chat.attendant = attendant
  await chat.save()

  return res.status(200).json(chat)
}