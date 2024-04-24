import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../../configs/server'
import { employeeModel } from '../../models/EmployeeModel'
import { User, userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'
import { UserFactory } from '../utils/user-factory'

describe('POST /employees', () => {
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

  it('should return 200 is pass valid data and is authenticated and authorized as admin', async () => {
    const { body } = await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: user.user._id,
        role: RoleEnum.EMPLOYEE
      })
      .expect(201)

    const savedEmployee = await employeeModel.findById(body._id)
    expect(savedEmployee).toBeTruthy()
    expect(savedEmployee?.user).toEqual(user.user._id)
  })

  it('should return 403 if pass a valid data and is authenticated as employee', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', employee.bearerToken)
      .send({
        userId: user.user._id,
        role: RoleEnum.EMPLOYEE
      })
      .expect(403)
  })

  it('should return 403 if pass a valid data and is authenticated as user', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', user.bearerToken)
      .send({
        userId: user.user._id,
        role: RoleEnum.EMPLOYEE
      })
      .expect(403)
  })

  it('should return 400 if pass a invalid userId', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: 'invalid',
        role: RoleEnum.EMPLOYEE
      })
      .expect(400)
  })

  it('should return 404 if pass a inexistent userId', async () => {
    const anotherId = new Types.ObjectId()
    const { body } = await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: anotherId.toString(),
        role: RoleEnum.EMPLOYEE
      })
      .expect(404)

    expect(body.queryParams).toEqual({ userId: anotherId.toString() })
  })

  it('should return 400 if pass a invalid role', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: user.user._id,
        role: 'invalid'
      })
      .expect(400)
  })

  it('should return 403 if pass a valid data and is authenticated and authorized as admin and already exists one', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: admin.user._id,
        role: RoleEnum.ADMIN
      })
      .expect(403)
  })

  it('should return 400 if pass user role', async () => {
    await supertest(server)
      .post('/employees')
      .set('Authorization', admin.bearerToken)
      .send({
        userId: user.user._id,
        role: RoleEnum.USER
      })
      .expect(400)
  })
})