import { Router } from 'express'
import { acceptChat, createChat, getChatById, getChatsByAttendant, getChatsByUser } from '../controllers/MessageController'

const chatRoutes = Router()

chatRoutes.put('/:chatId/accept', acceptChat)
chatRoutes.post('/', createChat)
chatRoutes.get('/:chatId', getChatById)
chatRoutes.get('/:attendantId', getChatsByAttendant)
chatRoutes.get('/:userId', getChatsByUser)


export default chatRoutes