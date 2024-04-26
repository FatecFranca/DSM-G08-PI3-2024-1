import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client'
import supertest from 'supertest'
import { env } from '../../configs/env'
import server from '../../configs/server'
import '../../configs/websockets'
import { chatModel } from '../../models/ChatModel'
import { employeeModel } from '../../models/EmployeeModel'
import { User, userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'
import { UserFactory } from '../utils/user-factory'

function waitOnce<T=any>(socket: ClientSocket, event: string){
  return new Promise<T>((resolve) => {
    socket.once(event, resolve)
  })
}

function waitEmitAck(socket: ClientSocket, event: string, data: any) {
  return new Promise<{ message: string, status: number }>((resolve) => {
    socket.emit(event, data, resolve)
  })
}

function connectServer(): Promise<ClientSocket> {
  return new Promise((resolve) => {
    server.listen(env.PORT, () => {
      const clientSocket = ioc(`http://localhost:${env.PORT}`)
      clientSocket.on('connect', () => {
        resolve(clientSocket)
      })
    })
  })
}

function produceSocketClient(): Promise<ClientSocket> {
  return new Promise((resolve) => {
    const clientSocket = ioc(`http://localhost:${env.PORT}`)
    clientSocket.on('connect', () => {
      resolve(clientSocket)
    })
  })
}

describe('POST /chats/:chatId/messages', () => {
  let patientClientSocket: ClientSocket
  let employeeClientSocker: ClientSocket

  let admin: {
    _id: Types.ObjectId,
    bearerToken: string
    user: User
  }
  let user: {
    _id: Types.ObjectId,
    bearerToken: string,
    user: User
  }
  let employee: {
    _id: Types.ObjectId,
    bearerToken: string,
    user: User
  }
  let createdUsersIds: Types.ObjectId[] = []
  let createdEmployeesIds: Types.ObjectId[] = []
  let chatId: Types.ObjectId

  beforeAll(async () => {
    
    createdUsersIds = []
    createdEmployeesIds = []
    const employeeUser = UserFactory.random()
    const adminUser = UserFactory.random()
    const anotherUser = UserFactory.random()

    const [
      createEmployeeUser,
      createAdminUser,
      createUser
    ] = await Promise.all([
      userModel.create({
        ...employeeUser,
        password: bcrypt.hashSync(employeeUser.password, 10)
      }),
      userModel.create({
        ...adminUser,
        password: bcrypt.hashSync(adminUser.password, 10)
      }),
      userModel.create({
        ...anotherUser,
        password: bcrypt.hashSync(anotherUser.password, 10)
      })
    ])
    const [
      employeeData, adminData
    ] = await Promise.all([
      employeeModel.create({
        user: createEmployeeUser._id,
        role: RoleEnum.EMPLOYEE
      }),
      employeeModel.create({
        user: createAdminUser._id,
        role: RoleEnum.ADMIN
      })
    ])

    const [employeeAuthResponse, adminAuthResponse, userAuthResponse] = await Promise.all([
      supertest(server).post('/auth/login-employee').send({ email: employeeUser.email, password: employeeUser.password }).expect(200),
      supertest(server).post('/auth/login-employee').send({ email: adminUser.email, password: adminUser.password }).expect(200),
      supertest(server).post('/auth/login').send({ email: anotherUser.email, password: anotherUser.password }).expect(200)
    ])

    employee = {
      _id: employeeData._id,
      bearerToken: 'Bearer ' + employeeAuthResponse.body.token,
      user: createEmployeeUser.toJSON()
    }
    admin = {
      _id: adminData._id,
      bearerToken: 'Bearer ' + adminAuthResponse.body.token,
      user: createAdminUser.toJSON()
    }
    user = {
      _id: createUser._id,
      bearerToken: 'Bearer ' + userAuthResponse.body.token,
      user: createUser.toJSON()
    }

    await new Promise((resolve, reject) => {
      try {
        server.listen(env.PORT, () => resolve(''))
      } catch (error) {
        reject(error)
      }
    })

  })



  afterAll(async () => {
    server.close()
    await Promise.all([
      employeeModel.findByIdAndDelete(employee._id),
      employeeModel.findByIdAndDelete(admin._id)
    ])
    await Promise.all([
      userModel.findByIdAndDelete(employee.user._id),
      userModel.findByIdAndDelete(admin.user._id),
      userModel.findByIdAndDelete(user.user._id)
    ])
  })

  beforeEach(async () => {
    const createdChat = await chatModel.create({
      patient: user._id,
      attendant: employee._id,
      messages: [],
    })

    chatId = createdChat._id
    patientClientSocket = await produceSocketClient()
    employeeClientSocker = await produceSocketClient()

    const response = await waitEmitAck(patientClientSocket, 'chat.enter', {
      token: user.bearerToken,
      chatId: chatId.toString()
    })
    const response2 = await waitEmitAck(employeeClientSocker, 'chat.enter', {
      token: employee.bearerToken,
      chatId: chatId.toString()
    })
    
    if (response.status !== 200 || response2.status !== 200) {
      throw [response, response2]
    }
  })

  afterEach(async () => {
    await patientClientSocket.close()
    await employeeClientSocker.close()
    await chatModel.findOneAndDelete({
      _id: chatId
    })
    await Promise.all(createdEmployeesIds.map(async id => userModel.findByIdAndDelete(id)))
    await Promise.all(createdUsersIds.map(async id => userModel.findByIdAndDelete(id)))
  })

  it('should return 201 when user is authenticated and pass correct params and body', async () => {
    const message = {
      message: 'Hello'
    }
    const waitOncePromise = waitOnce(patientClientSocket, 'chat.message.created')
    const waitOncePromiseEmployee = waitOnce(employeeClientSocker, 'chat.message.created')

    const { body } = await supertest(server)
      .post(`/chats/${chatId}/messages`)
      .set('Authorization', user.bearerToken)
      .send(message)
      .expect(201)

    const expectedMessage = {
      message: message.message,
      user: user._id.toString(),
      _id: expect.any(String),
      sentWhen: expect.any(String),
    }

    const messageAdded = await waitOncePromise
    const employeeMessageReceived = await waitOncePromiseEmployee
    expect(body).toEqual(expectedMessage)
    expect(messageAdded).toEqual({
      chatId: chatId.toString(),
      message: expectedMessage
    })
    expect(employeeMessageReceived).toEqual({
      chatId: chatId.toString(),
      message: expectedMessage
    })
  })

  it('should return 400 if do not pass message', async () => {
    await supertest(server)
      .post(`/chats/${chatId}/messages`)
      .set('Authorization', user.bearerToken)
      .expect(400)
  })

  it('should return 401 if user is not authenticated', async () => {
    await supertest(server)
      .post(`/chats/${chatId}/messages`)
      .send({ message: 'Hello' })
      .expect(401)
  })

  it('should return 404 if chat not found', async () => {
    const anotherId = new Types.ObjectId()
    const { body } = await supertest(server)
      .post(`/chats/${anotherId}/messages`)
      .set('Authorization', user.bearerToken)
      .send({ message: 'Hello' })
      .expect(404)
    
    expect(body.queryParams).toEqual({ id: anotherId.toString() })
  })
})