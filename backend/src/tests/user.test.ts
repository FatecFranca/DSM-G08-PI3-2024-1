import supertest from 'supertest'
import server from '../configs/server'
import { addressModel } from '../models/AddressModel'
import { User, userModel } from '../models/UserMode'

describe('User endpoint tests suite', () => {

  let user: User
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
    return userModel.deleteMany({})
  })

  describe('POST /users', () => {
    it('should reuturn created user', async () => {
      const response = await supertest(server)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(response.body._id)
      expect(savedUser).toBeTruthy()
      expect(response.body).toEqual({
        ...user,
        _id: expect.any(String),
        address: expect.any(String),
        data_nascimento: user.data_nascimento.toISOString(),
        password: expect.any(String),
        healthInfo: {
          ...user.healthInfo,
          _id: expect.any(String)
        }
      })
    })

    it('should create user even if healthInfo is not provided', async () => {
      delete user.healthInfo
      const { body } = await supertest(server)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(body._id)
      expect(savedUser).toBeTruthy()
    })

    it('should not save user password as plain text', async () => {
      const { body } = await supertest(server)
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
      
      await supertest(server)
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
      
      await supertest(server)
        .post('/users')
        .send({
          ...user,
          email: 'other@email.com'
        })
        .expect(400)
    })

    it.skip('should return 400 if pass invalid cpf', async () => {
      await supertest(server)
        .post('/users')
        .send({
          ...user,
          cpf: '123.456.789-09'
        })
        .expect(400)
    })

    it('should return 400 if pass invalid email', async () => {
      return supertest(server)
        .post('/users')
        .send({
          ...user,
          email: 'invalid_email'
        })
        .expect(400)
    })
  })
})