import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { chatModel } from '../../models/ChatModel'
import { RoleEnum } from '../../types/RoleEnum'


export const createChat = async (req: Request, res: Response) => {
  const payload = req.payload
  if (!payload || payload.role !== RoleEnum.USER) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const patient = payload.id as any

  const newChat = await chatModel.create({
    patient,
    messages: [],
  })

  return res.status(201).json(newChat)
}