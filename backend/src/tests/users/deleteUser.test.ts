import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../../configs/server'
import { User, userModel } from '../../models/UserModel'
import { UserFactory } from '../utils/user-factory'

describe('DELETE /users/:id', () => {
  let createdUserId: Types.ObjectId
  let user: User
  let expectedAddress: any
  let expectedUser: any
  let bearerToken: string

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
  })

  it('should return 401 if user is not authenticated', async () => {
    await supertest(server)
      .delete(`/users/${createdUserId}`)
      .expect(401)
  })

  it('should return 200 and delete user if authenticated', async () => {
    await supertest(server)
      .delete(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .expect(200)

    const existsUser = await userModel.findOne({ _id: createdUserId })
    expect(existsUser).toBeFalsy()
  })

  it('should return 403 if try to delete another user', async () => {
    const anotherUser = UserFactory.random()
    const antherUserData = await userModel.create(anotherUser)

    await supertest(server)
      .delete(`/users/${antherUserData._id}`)
      .set('Authorization', bearerToken)
      .expect(403)
    
    const anotherUserSaved = await userModel.findById(antherUserData._id)
    expect(anotherUserSaved).toBeTruthy()
  })
})