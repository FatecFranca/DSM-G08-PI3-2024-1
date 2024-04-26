import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { User, userModel } from '../../models/UserModel'
import { UserFactory } from '../utils/user-factory'
import supertest from 'supertest'
import server from '../../configs/server'

describe('POST /auth/login', () => {
  let createdUserId: Types.ObjectId
  let user: User
  let expectedAddress: any
  let expectedUser: any

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

    const createdUser = await userModel.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    })
    
    createdUserId = createdUser._id
  })

  afterAll(async () => {
    await userModel.deleteMany({
      _id: createdUserId
    })
  })

  it('should return 400 if do not pass email', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        password: user.password
      })
      .expect(400)
  })

  it('should return 400 if do not pass password', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        email: user.email
      })
      .expect(400)
  })

  it('should return 400 if do not pass body', async () => {
    await supertest(server)
      .post('/auth/login')
      .expect(400)
  })

  it('should return 404 if user with email does not exists', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        email: 'any@email.com',
        password: 'any_password'
      })
      .expect(404)
  })

  it('should return 401 if pass incorrect password', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'incorrect_password'
      })
      .expect(401)
  })

  it('should return 200 if pass correct credentials and body should contain token and user data', async () => {
    const { body } = await supertest(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password
      })
      .expect(200)

    expect(body.token).toBeTruthy()
    expect(body.user).toBeTruthy()
    expect(body.user._id).toBe(createdUserId.toString())
  })
})