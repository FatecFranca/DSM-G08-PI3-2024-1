import { Router } from 'express'
import { acceptChat, addMessage, createChat, getChatById, getChatsByAttendant, getChatsByUser } from '../controllers/MessageController'

const chatRoutes = Router()

chatRoutes.put('/:chatId/accept', acceptChat)
chatRoutes.post('/', createChat)
chatRoutes.get('/:chatId', getChatById)
chatRoutes.get('/:attendantId', getChatsByAttendant)
chatRoutes.get('/:userId', getChatsByUser)
chatRoutes.post('/:chatId/message', addMessage)

export default chatRoutes