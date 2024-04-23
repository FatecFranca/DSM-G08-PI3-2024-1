import supertest from 'supertest'
import app from '../configs/server'
import { User, userModel } from '../models/UserModel'
import { UserFactory } from './utils/user-factory'

describe('User endpoint tests suite', () => {

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
  })

  afterEach(async () => {
    await userModel.deleteMany({})
  })

  describe('PUT /users/:id', () => {
    let id: string
    let token: string

    beforeEach(async () => {
      const { body } = await supertest(app)
        .post('/users')
        .send(user)
      id = body._id
      const { body: loginBodyResponse } = await supertest(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
      token = loginBodyResponse.token
      return
    })

  describe('GET /users/:id', () => {
    let id: string
    let token: string
    beforeEach(async () => {
      const { body } = await supertest(app)
        .post('/users')

        .send(user)
      id = body._id
      const { body: loginBodyResponse } = await supertest(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
      token = loginBodyResponse.token
      return
    })

    it('should return 200 and user with address', async () => {
      const { body } = await supertest(app)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      
      expect(body).toEqual(expectedUser)
    })
  })

  describe('DELETE /users/:id', () => {
    let id: string
    let token: string
    beforeEach(async () => {
      const { body } = await supertest(app)
        .post('/users')
        .send(user)
      id = body._id
      const { body: loginBodyResponse } = await supertest(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
      token = loginBodyResponse.token
      return
    })

    it('should return 200 and delete user', async () => {
      await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      
      const savedUser = await userModel.findById(id)
      expect(savedUser).toBeFalsy()
    })
  })
})
