import 'express-async-errors'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'
import { ZodError } from 'zod'

const server = express()

server.use(express.json())
server.use(cors())
server.use(routes)

server.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors })
  }
  return res.status(500).json({ error: error.message })
})

export default server