import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../../configs/server'
import { employeeModel } from '../../models/EmployeeModel'
import { User, userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'
import { expectedUserBodyFromUserEntity } from '../utils/expectedUserBodyFromUserEntity'
import { UserFactory } from '../utils/user-factory'

describe('GET /employees/:id', () => {
  let admin: {
    _id: Types.ObjectId,
    bearerToken: string
    user: User
  }
  let user: {
    _id: Types.ObjectId,
    bearerToken: string,
    user: User
  }
  let employee: {
    _id: Types.ObjectId,
    bearerToken: string,
    user: User
  }
  let createdUsersIds: Types.ObjectId[] = []
  let createdEmployeesIds: Types.ObjectId[] = []

  beforeAll(async () => {
    createdUsersIds = []
    createdEmployeesIds = []
    const employeeUser = UserFactory.random()
    const adminUser = UserFactory.random()
    const anotherUser = UserFactory.random()

    const [
      createEmployeeUser,
      createAdminUser,
      createUser
    ] = await Promise.all([
      userModel.create({
        ...employeeUser,
        password: bcrypt.hashSync(employeeUser.password, 10)
      }),
      userModel.create({
        ...adminUser,
        password: bcrypt.hashSync(adminUser.password, 10)
      }),
      userModel.create({
        ...anotherUser,
        password: bcrypt.hashSync(anotherUser.password, 10)
      })
    ])
    const [
      employeeData, adminData
    ] = await Promise.all([
      employeeModel.create({
        user: createEmployeeUser._id,
        role: RoleEnum.EMPLOYEE
      }),
      employeeModel.create({
        user: createAdminUser._id,
        role: RoleEnum.ADMIN
      })
    ])

    const [employeeAuthResponse, adminAuthResponse, userAuthResponse] = await Promise.all([
      supertest(server).post('/auth/login-employee').send({ email: employeeUser.email, password: employeeUser.password }).expect(200),
      supertest(server).post('/auth/login-employee').send({ email: adminUser.email, password: adminUser.password }).expect(200),
      supertest(server).post('/auth/login').send({ email: anotherUser.email, password: anotherUser.password }).expect(200)
    ])

    employee = {
      _id: employeeData._id,
      bearerToken: 'Bearer ' + employeeAuthResponse.body.token,
      user: createEmployeeUser.toJSON()
    }
    admin = {
      _id: adminData._id,
      bearerToken: 'Bearer ' + adminAuthResponse.body.token,
      user: createAdminUser.toJSON()
    }
    user = {
      _id: createUser._id,
      bearerToken: 'Bearer ' + userAuthResponse.body.token,
      user: createUser.toJSON()
    }
  })

  afterAll(async () => {
    await Promise.all([
      employeeModel.findByIdAndDelete(employee._id),
      employeeModel.findByIdAndDelete(admin._id)
    ])
    await Promise.all([
      userModel.findByIdAndDelete(employee.user._id),
      userModel.findByIdAndDelete(admin.user._id),
      userModel.findByIdAndDelete(user.user._id)
    ])
  })

  afterEach(async () => {
    await Promise.all(createdEmployeesIds.map(async id => userModel.findByIdAndDelete(id)))
    await Promise.all(createdUsersIds.map(async id => userModel.findByIdAndDelete(id)))
  })
  
  it('should return 200 if pass id of existing employee and is authenticated as employee', async () => {
    const { body } = await supertest(server)
      .get(`/employees/${employee._id}`)
      .set('Authorization', employee.bearerToken)
      .expect(200)

    const { expectedUser } = expectedUserBodyFromUserEntity(employee.user)
    expect(body).toEqual({
      __v: expect.any(Number),
      _id: employee._id.toString(),
      user: expectedUser,
      role: RoleEnum.EMPLOYEE,
    })
  })

  it('should return 200 if pass id of existing employee and is authenticated as admin', async () => {
    const { body } = await supertest(server)
      .get(`/employees/${employee._id}`)
      .set('Authorization', admin.bearerToken)
      .expect(200)

    const { expectedUser } = expectedUserBodyFromUserEntity(employee.user)
    expect(body).toEqual({
      __v: expect.any(Number),
      _id: employee._id.toString(),
      user: expectedUser,
      role: RoleEnum.EMPLOYEE,
    })
  })

  it('should return 403 if pass id of existing employee and is authenticated as user', async () => {
    await supertest(server)
      .get(`/employees/${employee._id}`)
      .set('Authorization', user.bearerToken)
      .expect(403)
  })

  it('should return 404 if pass id of non-existing employee and is correctly authenticated', async () => {
    const anotherId = new Types.ObjectId()
    const { body } = await supertest(server)
      .get(`/employees/${anotherId}`)
      .set('Authorization', admin.bearerToken)
      .expect(404)
    
    expect(body.queryParams).toEqual({ id: anotherId.toString() })
  })

  it.todo('should return 403 when employee try to get another employee data that is not himself')
  it.todo('should return 200 when admin try to get another employee data')
})