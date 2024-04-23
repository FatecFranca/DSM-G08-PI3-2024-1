import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'

export const acceptChat = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Payload not found')
  }

  const attendant = payload.id as any

  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)
  if (!chat) {
    throw new NotFoundError('Chat not found', { id: chatId })
  }

  chat.attendant = attendant
  await chat.save()

  return res.status(200).json(chat)
}