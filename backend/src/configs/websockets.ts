import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { chatModel } from '../models/ChatModel'
import { RoleEnum } from '../types/RoleEnum'
import { env } from './env'
import { io } from './server'


const validToken = (bearerToken: string): Required<Request>['payload'] => {
  const [bearer, token] = bearerToken.split(' ')
  const payload = jwt.verify(token, env.JWT_SECRET) as Required<Request>['payload']

  return payload
}
//TODO: Intead of save only the rooms. Save sockets infos like userId and role.
//TODO: Works more like saga. Where chat has a saga like created, sent, error, received
const socketRooms: Record<string, string[]> = {}
io.on('connection', (socket) => {
  socket.on('chat.enter', async ({token, chatId}, ack) => {
    let payload: Required<Request>['payload']
    try {
      payload = validToken(token)
    } catch (error) {
      console.log('Invalid token')
      return ack({
        message: 'Invalid token',
        status: 401
      })
    }

    const chat = await chatModel.findById(chatId)
    if (!chat) {
      console.log('Chat not found')
      return ack({
        message: 'Chat not found',
        status: 404
      })
    }
    
    const inChat = userInChat(chat.patient.toString(), chat.attendant?.toString(), payload)
    if (!inChat) {
      console.log('User not in chat')
      return ack({
        message: 'User not in chat',
        status: 401
      })
    }

    if (!socketRooms[socket.id]) {
      socketRooms[socket.id] = []
    }

    socketRooms[socket.id].push(`chat:${chatId}`)

    socket.join(`chat:${chatId}`)

    return ack({
      chat: chat.toJSON(),
      status: 200
    })
  })

  socket.on('disconnect', async () => {
    const rooms = socketRooms[socket.id]
    if (rooms) {
      const promises = rooms.map(room => {
        return socket.leave(room)
      })
      await Promise.all(promises)
    }
  })
})

function userInChat(patient: string, attendant: string|undefined, payload: Required<Request>['payload']): boolean {
  let inChat = false
  if (payload.role === RoleEnum.USER) {
    inChat = patient === payload.id
  } else if (payload.role === RoleEnum.EMPLOYEE || payload.role === RoleEnum.ADMIN) {
    inChat = attendant === payload.id
  }

  return inChat
}