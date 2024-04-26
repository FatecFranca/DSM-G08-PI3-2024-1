import supertest from 'supertest'
import server from '../../configs/server'
import { User, userModel } from '../../models/UserModel'
import { UserFactory } from '../utils/user-factory'

describe('POST /users', () => { 
  let user: User
  let expectedAddress: any
  let expectedUser: any
  const createdUsersIds: Set<string> = new Set()
  beforeAll(async () => {
    user = UserFactory.random()

    expectedAddress = {
      ...user.address,
      _id: expect.any(String)
    }

    expectedUser = {
      ...user,
      _id: expect.any(String),
      address: expectedAddress,
      data_nascimento: user.data_nascimento.toISOString(),
      healthInfo: expect.objectContaining(user.healthInfo),
      password: expect.any(String),
      __v: expect.any(Number)
    }
  })

  afterEach(async () => {
    for (const id of createdUsersIds) {
      await userModel.deleteMany({ _id: id})
    }
  })

  it('should return status 201 and created user', async () => {
    const response = await supertest(server)
      .post('/users')
      .send(user)
      .expect(201)
    createdUsersIds.add(response.body._id)
    
    const savedUser = await userModel.findById(response.body._id)
    expect(savedUser).toBeTruthy()
    expect(response.body).toEqual(expectedUser)
  })

  it('should return 201 and create user even if healthInfo is not provided', async () => {
    delete user.healthInfo
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
      .expect(201)
    createdUsersIds.add(body._id)

    const savedUser = await userModel.findById(body._id)
    expect(savedUser).toBeTruthy()
  })

  it('should not save user password as plain text', async () => {
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
      .expect(201)
    createdUsersIds.add(body._id)
    const savedUser = await userModel.findById(body._id)

    expect(savedUser).toBeTruthy()
    expect(savedUser?.password).not.toBe(user.password)
  })

  it('should return 400 if pass invalid cpf data type', async () => {
    await supertest(server)
      .post('/users')
      .send({ ...user, cpf: '123.456.789-96' })
      .expect(400)
  })

  it('should return 400 if pass invalid email data type', async () => {
    await supertest(server)
      .post('/users')
      .send({ ...user, email: 'invalid-email' })
      .expect(400)
  })

  it('should return 400 if already exists a user with this email', async () => {
    const anotherUser = UserFactory.random()
    const existentUser = await userModel.create({...anotherUser, email: user.email})
    createdUsersIds.add(existentUser._id.toString())
    
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
      .expect(400)

    expect(body.duplicatedIndexes).toEqual({ email: user.email })
    expect(body.message.toLocaleLowerCase()).toContain('email')
  })

  it('should return 400 if already exists a user with this cpf', async () => {
    const anotherUser = UserFactory.random()
    const existentUser = await userModel.create({...anotherUser, cpf: user.cpf})
    createdUsersIds.add(existentUser._id.toString())
    
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
      .expect(400)

    expect(body.duplicatedIndexes).toEqual({ cpf: user.cpf })
    expect(body.message.toLocaleLowerCase()).toContain('cpf')
  })

  it('should return 400 if alread exists a user with this email and cpf', async () => {
    const anotherUser = UserFactory.random()
    const existentUser = await userModel.create({...anotherUser, email: user.email, cpf: user.cpf})
    createdUsersIds.add(existentUser._id.toString())

    const { body } = await supertest(server)
      .post('/users')
      .send(user)
      .expect(400)

    expect(body.duplicatedIndexes).toEqual({ email: user.email, cpf: user.cpf })
    expect(body.message.toLocaleLowerCase()).toContain('email')
    expect(body.message.toLocaleLowerCase()).toContain('cpf')
  })
})  