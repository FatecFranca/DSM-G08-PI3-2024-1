import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../configs/server'
import { addressModel } from '../models/AddressModel'
import { User, userModel } from '../models/UserModel'

describe('Auth endpoints tests suite', () => {
  let id: Types.ObjectId
  let user: User
  let expectedAddress: any
  let expectedUser: any

  beforeEach(async () => {
    user = {
      name: 'any_name',
      lastName: 'any_last_name',
      email: 'any@email.com',
      cpf: '132.456.789-09',
      gender: 'M',
      data_nascimento: new Date('1998-10-10'),
      password: 'any_password',
      address: {
        cep: 'any_cep',
        street: 'any_street',
        num: '123',
        city: 'any_city',
        uf: 'SP'
      },
      healthInfo: {
        allergy: 'any_allergy',
        cardiorespiratoryDisease: 'any_cardiorespiratoryDisease',
        medicineInUse: 'any_medicineInUse',
        preExistingCondition: 'any_preExistingCondition',
        surgery: 'any_surgery',
      }
    }

    expectedAddress = {
      ...user.address,
      _id: expect.any(String),
      __v: expect.any(Number)
    }

    expectedUser = {
      ...user,
      _id: expect.any(String),
      address: expect.objectContaining({
        ...user.address,
        _id: expect.any(String)
      }),
      data_nascimento: user.data_nascimento.toISOString(),
      healthInfo: expect.objectContaining(user.healthInfo),
      password: expect.any(String),
      __v: expect.any(Number)
    }
    await userModel.deleteMany({})
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
    id = body._id
  })

  afterEach(async () => {
    await userModel.deleteMany({})
    await addressModel.deleteMany({})
  })

  describe('POST /auth/login', () => {
    it('should return 200 and a token when user pass correct credentials', async () => {
      const { body } = await supertest(server)
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
      const { body } = await supertest(server)
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password
        })
      token = body.token
    })

    it('should return 200 and a message when token is valid', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })

    it('should return 401 when token is not provided', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .expect(401)
    })

    it('should return 401 when token is invalid', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401)
    })

    it('should return 401 when token is empty', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer ')
        .expect(401)
    })

    it('should return 401 when token is null', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .set('Authorization', 'Bearer')
        .expect(401)
    })

    it('should return 401 when token is not a Bearer token', async () => {
      await supertest(server)
        .get('/auth/verify-token')
        .set('Authorization', token)
        .expect(401)
    })
  })
})
