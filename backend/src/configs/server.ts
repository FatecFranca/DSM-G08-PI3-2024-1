import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import http from 'http'
import { ZodError } from 'zod'
import routes from './routes'
import { Server } from 'socket.io'

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors })
  }
  console.log(error)
  return res.status(500).json({ error: error.message })
})

const server = http.createServer(app)
const io = new Server(server)
export { io }
export default server