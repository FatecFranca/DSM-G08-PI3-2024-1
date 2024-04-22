import { Router } from 'express'
import { acceptChat, addMessage, createChat, getChatById, getChatsByAttendant, getChatsByUser } from '../controllers/MessageController'

const chatRoutes = Router()

chatRoutes.put('/:chatId/accept', acceptChat)
chatRoutes.post('/', createChat)
chatRoutes.get('/:chatId', getChatById)
chatRoutes.get('/attendant/:attendantId', getChatsByAttendant)
chatRoutes.get('/patient/:userId', getChatsByUser)
chatRoutes.post('/:chatId/messages', addMessage)

export default chatRoutes