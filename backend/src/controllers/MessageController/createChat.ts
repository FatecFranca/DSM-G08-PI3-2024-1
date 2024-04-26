import { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import { chatModel } from '../../models/ChatModel'


export const createChat = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Missing payload in request')
  }

  const patient = payload.id as any

  const newChat = await chatModel.create({
    patient,
    messages: [],
  })

  return res.status(201).json(newChat)
}