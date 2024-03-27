import { Request, Response } from 'express'

export const verifyToken = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Token is valid'
  })
}