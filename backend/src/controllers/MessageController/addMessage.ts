import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { io } from '../../configs/server'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'
import { chatModel } from '../../models/ChatModel'

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

  const notInChat = ![chat.patient.toString(), chat.attendant?.toString()].includes(payload.id as any)
  if (notInChat) {
    throw AppError.forbidden('User not in chat')
  }

  const messageData = {
    message, user: payload.id,
    _id: new mongoose.Types.ObjectId(),
    sentWhen: new Date(),
  }

  chat.messages.push(messageData)
  chat.markModified('messages')
  await chat.save()

  io.to(`chat:${chatId}`).emit('chat.message.created', {chatId, message: messageData})
  return res.status(201).json(messageData)
}