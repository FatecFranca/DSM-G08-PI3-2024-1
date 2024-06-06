import { Request, Response } from 'express'

export const verifyToken = async (req: Request, res: Response) => {
  if (!req.payload) {
    throw new Error('Payload not found')
  }

  return res.status(200).json(req.payload)
}