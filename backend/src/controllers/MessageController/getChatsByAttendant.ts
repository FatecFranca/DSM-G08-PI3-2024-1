import { Request, Response } from 'express'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'
import { AppError } from '../../errors/AppError'

export const getChatsByAttendant = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload) {
    throw AppError.internalServerError('Missing payload in request')
  }

  const attendantId = req.params.attendantId

  const chats = await chatModel.find({ attendant: attendantId })

  const isNotAdmin = payload.role !== RoleEnum.ADMIN
  const isNotAuthorized = payload.id !== attendantId

  if (isNotAdmin && isNotAuthorized) {
    throw AppError.forbidden('Forbidden access to chats')
  }
  
  return res.status(200).json(chats)
}