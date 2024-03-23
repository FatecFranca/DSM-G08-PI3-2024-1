import supertest from 'supertest'
import server from '../configs/server'
import { User, userModel } from '../models/UserMode'

describe('User endpoint tests suite', () => {
  // beforeAll(async () => {
  //   console.log(`Connecting to database: ${env.DATABASE_URL}`)
  //   return mongoose.connect(env.DATABASE_URL)
  // })

  // afterAll(async () => {
  //   console.log('Closing connection...')
  //   return mongoose.disconnect()
  // })
  
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

    it.skip('should not save user password as plain text', async () => {
      const { body } = await supertest(server)
        .post('/users')
        .send(user)
        .expect(201)
      const savedUser = await userModel.findById(body._id)
      expect(savedUser?.password).not.toBe(user.password)
    })
  })
})