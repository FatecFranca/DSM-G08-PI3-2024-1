import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../configs/server'
import { employeeModel } from '../models/EmployeeModel'
import { RoleEnum } from '../types/RoleEnum'
import { UserFactory } from './utils/user-factory'

describe('Employees endpoint tests suite', () => {
  let employeeUserId: string
  let adminUserId: string
  let userBearerToken: string

  const admin = UserFactory.random()
  const user = UserFactory.random()

  beforeAll(async () => {
    const { body: adminBody } = await supertest(server)
      .post('/users')
      .send(admin)
    const { body: userBody } = await supertest(server)
      .post('/users')
      .send(user)
  
    const { body: token } = await supertest(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password
      }).expect(200)
    
    userBearerToken = `Bearer ${token.token}`

    adminUserId = adminBody._id
    employeeUserId = userBody._id
  })

  beforeEach(async () => {
    await employeeModel.deleteMany({})
  })

  afterAll(async () => {
    await employeeModel.deleteMany({})
  })

  describe('POST /employees', () => {
    
    it('should create a new admin if not admin employee registered', async () => {
      const { body } = await supertest(server)
        .post('/employees')
        .set('Authorization', userBearerToken)
        .send({
          userId: adminUserId,
          role: RoleEnum.ADMIN
        }).expect(201)
      expect(body).toEqual({
        _id: expect.any(String),
        user: adminUserId,
        role: RoleEnum.ADMIN,
        __v: expect.any(Number)
      })
      expect(await employeeModel.find({
        role: RoleEnum.ADMIN
      })).toHaveLength(1)
    })

    describe('POST /employees when already exists an admin', () => {
      let adminBearerToken: string
      
      beforeEach(async () => {
        await supertest(server)
          .post('/employees')
          .set('Authorization', userBearerToken)
          .send({
            userId: adminUserId,
            role: RoleEnum.ADMIN
          }).expect(201)
        
        const { body } = await supertest(server)
          .post('/auth/login-employee')
          .send({
            email: admin.email,
            password: admin.password
          })

        adminBearerToken = `Bearer ${body.token}`
      })

      afterEach(async () => {
        await employeeModel.deleteMany({})
      })

      it('should return 403 if trying to create a new admin when already exists one', async () => {
        await supertest(server)
          .post('/employees')
          .set('Authorization', adminBearerToken)
          .send({
            userId: adminUserId,
            role: RoleEnum.ADMIN
          }).expect(403)
      })

      it('should return 201 if pass a valid employee', async () => {
        const { body } = await supertest(server)
          .post('/employees')
          .set('Authorization', adminBearerToken)
          .send({
            userId: employeeUserId,
            role: RoleEnum.EMPLOYEE
          }).expect(201)

        expect(body).toEqual({
          _id: expect.any(String),
          user: employeeUserId,
          role: RoleEnum.EMPLOYEE,
          __v: expect.any(Number)
        })
      })

      it('should return 400 if pass a invalid types.ObjectId', async () => {
        await supertest(server)
          .post('/employees')
          .set('Authorization', adminBearerToken)
          .send({
            userId: 'invalid',
            role: RoleEnum.EMPLOYEE
          }).expect(400)
      })

      it('should return 400 if pass a inexistent user', async () => {
        await supertest(server)
          .post('/employees')
          .set('Authorization', adminBearerToken)
          .send({
            userId: new Types.ObjectId(),
            role: RoleEnum.EMPLOYEE
          }).expect(404)
      })

      it('should return 400 if pass a invalid role', async () => {
        await supertest(server)
          .post('/employees')
          .set('Authorization', adminBearerToken)
          .send({
            userId: employeeUserId,
            role: 'invalid'
          }).expect(400)
      })
    })
  })
})