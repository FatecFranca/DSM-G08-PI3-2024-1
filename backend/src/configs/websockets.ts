import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { chatModel } from '../models/ChatModel'
import { RoleEnum } from '../types/RoleEnum'
import { env } from './env'
import { io } from './server'


const validToken = (token: string): Required<Request>['payload'] => {
  const payload = jwt.verify(token, env.JWT_SECRET) as Required<Request>['payload']

  return payload
}
//TODO: Intead of save only the rooms. Save sockets infos like userId and role.
//TODO: Works more like saga. Where chat has a saga like created, sent, error, received
const socketRooms: Record<string, string[]> = {}
io.on('connection', (socket) => {
  socket.on('chat.enter', async ({token, chatId}) => {
    let payload: Required<Request>['payload']
    try {
      payload = validToken(token)
    } catch (error) {
      return socket.emit('chat.enter:error', {message: 'Invalid token', status: 401})
    }
    const chat = await chatModel.findById(chatId)
    if (!chat) {
      return socket.emit('chat.enter:error', {message: 'Chat not found', status: 404})
    }
    
    const inChat = userInChat(chat.patient, chat.attendant, payload)
    if (!inChat) {
      return socket.emit('chat.enter:error', {message: 'User not in chat', status: 401})
    }

    if (!socketRooms[socket.id]) {
      socketRooms[socket.id] = []
    }

    socketRooms[socket.id].push(`chat:${chatId}`)

    socket.join(`chat:${chatId}`)
  })

  socket.on('chat.message.add', ({token, chatId, message}) => {
    let payload: Required<Request>['payload']
    try {
      payload = validToken(token)
    } catch (error) {
      return socket.emit('chat.message.add:error', {message: 'Invalid token', status: 401})
    }
    const chat = chatModel.findById(chatId)
    if (!chat) {
      return socket.emit('chat.message.add:error', {message: 'Chat not found', status: 404})
    }

    io.to(`chat:${chatId}`).emit('chat.message.add:sucess', {message})
  })

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id)
    const rooms = socketRooms[socket.id]
    if (rooms) {
      rooms.forEach(room => {
        socket.leave(room)
      })
    }
  })
})

function userInChat(patient: Types.ObjectId, attendant: Types.ObjectId|null|undefined, payload: Required<Request>['payload']): boolean {
  let inChat = false
  if (payload.role === RoleEnum.USER) {
    inChat = patient === payload.id as unknown as Types.ObjectId
  } {
    inChat = attendant === payload.id as unknown as Types.ObjectId
  }

  return inChat
}