import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import http from 'http'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { BodyValidationError } from '../errors/BodyValidationError'
import swaggerFile from '../swagger_output.json'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerFile, {
  swaggerOptions: {
    supportedSubmitMethods: []
  }
}))

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  let resultError: AppError
  switch (error.constructor) {
  case AppError:
    resultError = error
    break
  case ZodError:
    resultError = BodyValidationError.fromZodError(error)
    break
  default:
    console.log(error)
    resultError = AppError.internalServerError('Internal server error')
    break
  }

  return res.status(resultError.statusCode).json(resultError)
})

const server = http.createServer(app)
const io = new Server(server)
export { io }
export default server