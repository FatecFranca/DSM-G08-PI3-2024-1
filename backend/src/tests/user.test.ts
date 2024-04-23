import supertest from 'supertest'
import app from '../configs/server'
import { addressModel } from '../models/AddressModel'
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
      _id: expect.any(String),
      __v: expect.any(Number)
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
    await addressModel.deleteMany({})
    await userModel.deleteMany({})
  })

  describe('POST /users', () => {
    it('should return created user', async () => {
      const response = await supertest(app)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(response.body._id)
      expect(response.body).toEqual(expectedUser)
    })

    it('should create user even if healthInfo is not provided', async () => {
      delete user.healthInfo
      const { body } = await supertest(app)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(body._id)
      expect(savedUser).toBeTruthy()
    })

    it('should not save user password as plain text', async () => {
      const { body } = await supertest(app)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(body._id)
      expect(savedUser?.password).not.toBe(user.password)
    })

    it('should return 400 if already exists a user with this email', async () => {
      const address = await addressModel.create(user.address)
      const existentUser = new userModel({
        ...user,
        address: address._id
      })

      await existentUser.save()
      
      await supertest(app)
        .post('/users')
        .send(user)
        .expect(400)
    })

    it('should return 400 if already exists a user with this cpf', async () => {
      const address = await addressModel.create(user.address)
      const existentUser = new userModel({
        ...user,
        address: address._id
      })

      await existentUser.save()
      
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          email: 'other@email.com'
        })
        .expect(400)
    })

    it.skip('should return 400 if pass invalid cpf', async () => {
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          cpf: '123.456.789-09'
        })
        .expect(400)
    })

    it('should return 400 if pass invalid email', async () => {
      return supertest(app)
        .post('/users')
        .send({
          ...user,
          email: 'invalid_email'
        })
        .expect(400)
    })
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

    it('should return 401 if user is not authenticated', async () => {
      await supertest(app)
        .put(`/users/${id}`)
        .send(user)
        .expect(401)
    })

    it('should return 200 and updated user', async () => {
      const newName = 'new_name'
      const newAddressName = 'new_street'
      const updatedUser = {
        ...user,
        name: newName,
        email: undefined,
        password: undefined,
        address: {
          ...user.address,
          street: newAddressName
        }
      }
      const { body } = await supertest(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(200)
      const savedUser = await userModel.findById(id)
        .populate('address')

      expect(savedUser).toBeTruthy()
      expect(savedUser?.name).toBe(newName)
      expect((savedUser?.address as unknown as any).street).toBe(newAddressName)
      expect(body).toEqual({
        ...expectedUser,
        name: newName,
        address: {
          ...expectedAddress,
          street: newAddressName
        }
      })

    })
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