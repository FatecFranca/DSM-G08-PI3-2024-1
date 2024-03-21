import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'

const server = express()

server.use(express.json())
server.use(cors())
server.use(routes)

server.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  res.status(500).json({ error: error.message })
})

export default server