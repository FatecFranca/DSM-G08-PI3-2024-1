import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'

const zodCreateChatSchema = z.object({
  patient: z.instanceof(mongoose.Types.ObjectId),
})
export const createChat = async (req: Request, res: Response) => {
  const { patient } = zodCreateChatSchema.parse(req.body)

  const newChat = await chatModel.create({
    patient,
    messages: [],
  })

  return res.status(201).json(newChat)
}