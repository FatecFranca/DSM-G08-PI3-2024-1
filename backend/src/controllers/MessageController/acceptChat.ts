import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'

export const acceptChat = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload || ![RoleEnum.ADMIN, RoleEnum.EMPLOYEE].includes(payload.role)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const attendant = payload.id as any

  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' })
  }

  chat.attendant = attendant
  await chat.save()

  return res.status(200).json(chat)
}