import { Request, Response } from 'express'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'
import { io } from '../../configs/server'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'
import { th } from '@faker-js/faker'

const zodBodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
})

export const addMessage = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Missing payload in request')
  }

  const { message } = zodBodySchema.parse(req.body)

  const chatId = req.params.chatId
  const chat = await chatModel.findById(chatId)
  if (!chat) {
    throw new NotFoundError('Chat not found', { id: chatId })
  }

  const notInChat = ![chat.patient, chat.attendant].includes(payload.id as any)
  if (notInChat) {
    throw AppError.forbidden('User not in chat')
  }

  chat.messages.push({message, sender: payload.id})

  io.to(`chat:${chatId}`).emit('chat.message.created', {message})
  return res.status(201).json({message: 'Message added'})
}