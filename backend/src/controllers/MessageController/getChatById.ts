import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'
import { AppError } from '../../errors/AppError'
import { NotFoundError } from '../../errors/NotFoundError'

export const getChatById = async (req: Request, res: Response) => {
  //@ts-ignore
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Missing payload in request')
  }


  const chatId = req.params.chatId

  const chat = await chatModel.findById(chatId)

  if (!chat) {
    throw new NotFoundError('Chat not found', { id: chatId })
  }
  const isNotAdmin = payload.role !== RoleEnum.ADMIN
  const isNotInChat = ![chat.patient.toString(), chat.attendant?.toString()].includes(payload.id)

  if (isNotAdmin && isNotInChat) {
    throw AppError.forbidden('Forbidden access to chat')
  }

  return res.status(200).json(chat)
}