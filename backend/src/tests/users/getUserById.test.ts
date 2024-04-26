import supertest from 'supertest'
import { User, userModel } from '../../models/UserModel'
import { UserFactory } from '../utils/user-factory'
import server from '../../configs/server'
import { Types } from 'mongoose'
import { employeeModel } from '../../models/EmployeeModel'

describe('GET /users/:id', () => {
  let createdUserId: Types.ObjectId
  let user: User
  let expectedAddress: any
  let expectedUser: any
  let bearerToken: string
  let createdUsersIds: Types.ObjectId[] = []

  beforeAll(async () => {
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

  beforeEach(async () => {
    createdUsersIds = []
    const { body } = await supertest(server)
      .post('/users')
      .send(user)
    
    createdUserId = body._id
    const { body: authBody } = await supertest(server)
      .post('/auth/login')
      .send({ email: user.email, password: user.password })

    bearerToken = `Bearer ${authBody.token}`
  })

  afterEach(async () => {
    await userModel.deleteMany({
      _id: createdUserId
    })

    createdUsersIds.forEach(async id => {
      await userModel.deleteMany({ _id: id })
    })
  })

  it('should return 401 if user is not authenticated', async () => {
    await supertest(server)
      .get(`/users/${createdUserId}`)
      .expect(401)
  })

  it('should return 200 if user is authenticated and pass correct id', async () => {
    const { body } = await supertest(server)
      .get(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .expect(200)
    
    expect(body).toEqual(expectedUser)
  })

  it('should return 404 if pass unexistent id', async () => {
    await userModel.deleteOne({ _id: createdUserId })
    await supertest(server)
      .get(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .expect(404)
  })

  it('should return 403 if pass id from another user', async () => {
    const anotherUser = UserFactory.random()
    const anotherUserData = await userModel.create(anotherUser)

    await supertest(server)
      .get(`/users/${anotherUserData._id}`)
      .set('Authorization', bearerToken)
      .expect(403)
  })

  it.todo('should return 200 even if is another user if requester is an employee')
})