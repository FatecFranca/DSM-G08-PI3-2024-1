import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../../configs/server'
import { employeeModel } from '../../models/EmployeeModel'
import { User, userModel } from '../../models/UserModel'
import { RoleEnum } from '../../types/RoleEnum'
import { expectedUserBodyFromUserEntity } from '../utils/expectedUserBodyFromUserEntity'
import { UserFactory } from '../utils/user-factory'
import jwt from 'jsonwebtoken'

//TODO: Has some colateral effects that make the test fail sometimes. Find out later why. Try to isolate the test by deleting only the created resources
describe('POST /auth/login-employee', () => {
  let employee: {
    _id: Types.ObjectId,
    password: string,
    user: User
  }
  let admin: {
    _id: Types.ObjectId,
    password: string,
    user: User
  }
  let createdUsersIds: Types.ObjectId[] = []

  beforeAll(async () => {
    createdUsersIds = []
    const employeeUser = UserFactory.random()
    const adminUser = UserFactory.random()
    
    const [
      createEmployeeUser,
      createAdminUser
    ] = await Promise.all([
      userModel.create({
        ...employeeUser,
        password: bcrypt.hashSync(employeeUser.password, 10)
      }),
      userModel.create({
        ...adminUser,
        password: bcrypt.hashSync(adminUser.password, 10)
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

    employee = {
      _id: employeeData._id,
      password: employeeUser.password,
      user: createEmployeeUser.toJSON()
    }
    admin = {
      _id: adminData._id,
      password: adminUser.password,
      user: createAdminUser.toJSON()
    }
  })

  afterAll(async () => {
    await Promise.all([
      employeeModel.findByIdAndDelete(employee._id),
      employeeModel.findByIdAndDelete(admin._id)
    ])
    await Promise.all([
      userModel.findByIdAndDelete(employee.user._id),
      userModel.findByIdAndDelete(admin.user._id)
    ])
  })

  afterEach(async () => {
    await Promise.all(createdUsersIds.map(async id => {
      await userModel.findByIdAndDelete(id)
    }))
  })

  it('should return 400 if do not pass email', async () => {
    await supertest(server)
      .post('/auth/login-employee')
      .send({
        password: employee.user.password
      })
      .expect(400)
  })

  it('should return 400 if do not pass password', async () => {
    await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: employee.user.email
      })
      .expect(400)
  })

  it('should return 400 if do not pass body', async () => {
    await supertest(server)
      .post('/auth/login-employee')
      .expect(400)
  })

  it('should return 404 if user with email does not exists', async () => {
    await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: 'any@email.com',
        password: 'any_password'
      })
      .expect(404)
  })

  it('should return 401 if pass incorrect password', async () => {
    await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: employee.user.email,
        password: 'incorrect_password'
      })
      .expect(401)
  })

  it('should return 404 if email does not belong to an employee', async () => {
    const anotherUser = UserFactory.random()
    const createdUser = await userModel.create({
      ...anotherUser,
      password: bcrypt.hashSync(anotherUser.password, 10)
    })
    createdUsersIds.push(createdUser._id)

    await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: anotherUser.email,
        password: anotherUser.password
      })
      .expect(404)
  })

  it('should return 200 and the body with the employee and token when pass correct credentials', async () => {
    const { body } = await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: employee.user.email,
        password: employee.password
      })
      .expect(200)

    expect(body.token).toEqual(expect.any(String))
    expect(body.employee.role).toBe(RoleEnum.EMPLOYEE)
    expect(body.employee.employeeId).toEqual(employee._id.toString())
    expect(body.employee.user).toEqual(expectedUserBodyFromUserEntity(employee.user).expectedUser)
  })

  it('should return 200 and the body with the admin and token when pass correct credentials', async () => {
    const { body } = await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: admin.user.email,
        password: admin.password
      })
      .expect(200)

    expect(body.token).toEqual(expect.any(String))
    expect(body.employee.role).toBe(RoleEnum.ADMIN)
    expect(body.employee.employeeId).toEqual(admin._id.toString())
    expect(body.employee.user).toEqual(expectedUserBodyFromUserEntity(admin.user).expectedUser)
  })

  it('should return 200 and its token should have the employee id and role in the payload', async () => {
    const { body } = await supertest(server)
      .post('/auth/login-employee')
      .send({
        email: employee.user.email,
        password: employee.password
      })
      .expect(200)

    const decoded = jwt.decode(body.token) as any
    expect(decoded.id).toBe(employee._id.toString())
    expect(decoded.role).toBe(RoleEnum.EMPLOYEE)
  })
})
