import supertest from 'supertest'
import server from '../configs/server'
import { addressModel } from '../models/AddressModel'
import { User, userModel } from '../models/UserMode'

describe('User endpoint tests suite', () => {

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

    return userModel.deleteMany({})
  })

  afterEach(async () => {
    await userModel.deleteMany({})
    await addressModel.deleteMany({})
  })

  describe('POST /users', () => {
    it('should reuturn created user', async () => {
      const response = await supertest(server)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(response.body._id)
      expect(savedUser).toBeTruthy()
      expect(response.body).toEqual(expectedUser)
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

  describe('PUT /users/:id', () => {
    let id: string
    beforeEach(async () => {
      const { body } = await supertest(server)
        .post('/users')
        .send(user)
      id = body._id
      return
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
      const { body } = await supertest(server)
        .put(`/users/${id}`)
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
    beforeEach(async () => {
      const { body } = await supertest(server)
        .post('/users')
        .send(user)
      id = body._id
      return
    })

    it('should return 200 and user with address', async () => {
      const { body } = await supertest(server)
        .get(`/users/${id}`)
        .expect(200)
      
      expect(body).toEqual(expectedUser)
    })
  })
})