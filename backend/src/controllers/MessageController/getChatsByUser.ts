import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'
import { AppError } from '../../errors/AppError'

export const getChatsByUser = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Missing payload in request')
  }

  const userId = req.params.userId

  const chats = await chatModel.find({ patient: userId })

  const isEmployee = payload.role !== RoleEnum.USER
  const isNotAuthorized = payload.id !== userId
  if (isEmployee && isNotAuthorized) {
    throw AppError.forbidden('Forbidden access to chats')
  }

  return res.status(200).json(chats)
}