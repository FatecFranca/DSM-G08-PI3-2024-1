import { Router } from 'express'
import { acceptChat, addMessage, createChat, getChatById, getChats, getChatsByAttendant, getChatsByUser } from '../controllers/MessageController'
import { authenticated } from '../middlewares/authenticated'
import { authorize } from '../middlewares/authorize'
import { AuthorizationPolicy } from '../types/AuthorizationPolicy'

const chatRoutes = Router()

chatRoutes.put('/:chatId/accept', authenticated, authorize(AuthorizationPolicy.allEmployees()), acceptChat)
chatRoutes.post('/', authenticated, authorize(AuthorizationPolicy.onlyUsers()), createChat)
chatRoutes.get('/', authenticated, authorize(AuthorizationPolicy.allEmployees()), getChats)
chatRoutes.get('/:chatId', authenticated, getChatById)
chatRoutes.get('/attendant/:attendantId', getChatsByAttendant)
chatRoutes.get('/patient/:userId', authenticated, getChatsByUser)
chatRoutes.post('/:chatId/messages', authenticated, addMessage)

export default chatRoutes