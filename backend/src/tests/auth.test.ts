import { Types } from 'mongoose'
import supertest from 'supertest'
import app from '../configs/server'
import { User, userModel } from '../models/UserModel'
import { UserFactory } from './utils/user-factory'

describe('Auth endpoints tests suite', () => {
  let id: Types.ObjectId
  let user: User
  let expectedAddress: any
  let expectedUser: any

  beforeEach(async () => {
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
    await userModel.deleteMany({})
    const { body } = await supertest(app)
      .post('/users')
      .send(user)
    id = body._id
  })

  afterEach(async () => {
    await userModel.deleteMany({})
  })

  describe('POST /auth/login', () => {
    it('should return 200 and a token when user pass correct credentials', async () => {
      const { body } = await supertest(app)
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password
        })
        .expect(200)
      
      expect(body).toEqual({
        token: expect.any(String)
      })
    })
  
    it.skip('should return 401 when user pass incorrect credentials', async () => {
  
    })
  })

  describe('GET /auth/verify-token', () => {
    let token: string
    beforeEach(async () => {
      const { body } = await supertest(app)
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password
        })
      token = body.token
    })

    it('should return 200 and a message when token is valid', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })

    it('should return 401 when token is not provided', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .expect(401)
    })

    it('should return 401 when token is invalid', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401)
    })

    it('should return 401 when token is empty', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer ')
        .expect(401)
    })

    it('should return 401 when token is null', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer')
        .expect(401)
    })

    it('should return 401 when token is not a Bearer token', async () => {
      await supertest(app)
        .get('/auth/verify-token')
        .set('Authorization', token)
        .expect(401)
    })
  })
})
