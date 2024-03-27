import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../configs/env'

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({
      message: 'Token is required'
    })
  }
  const [bearer, tokenValue] = token.split(' ')
  if (bearer !== 'Bearer') {
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
  
  if (!tokenValue) {
    return res.status(401).json({
      message: 'Token is required'
    })
  }
  
  try {
    const payload = jwt.verify(tokenValue, env.JWT_SECRET) as {
      id: string
    }
    
    req.payload = payload
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
  next()
}