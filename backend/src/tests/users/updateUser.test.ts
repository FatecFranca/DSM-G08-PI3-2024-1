import { Types } from 'mongoose'
import supertest from 'supertest'
import server from '../../configs/server'
import { User, userModel } from '../../models/UserModel'
import { UserFactory } from '../utils/user-factory'

describe('PUT /users/:id', () => {
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

  afterAll(async () => {
    await userModel.deleteMany({
      _id: createdUserId
    })

    await Promise.all(createdUsersIds.map(async id => {
      await userModel.deleteMany({ _id: id })
    }))
  })

  it('should return 401 if user is not authenticated', async () => {
    await supertest(server)
      .put(`/users/${createdUserId}`)
      .send(user)
      .expect(401)
  })

  it('should return 200 and updated user when pass correct data', async () => {
    const newName = 'new_name'
    const newAddressName = 'new_street'

    const updatedUser = {
      name: newName,
      address: {
        ...user.address,
        street: newAddressName
      }
    }

    const { body } = await supertest(server)
      .put(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .send(updatedUser)
      .expect(200)

    const savedUser = await userModel.findById(createdUserId)
    expect(savedUser).toBeTruthy()
    expect(body).toEqual({
      ...expectedUser,
      name: newName,
      address: {
        ...expectedAddress,
        street: newAddressName
      }
    })
    expect(savedUser?.name).toBe(newName)
    expect(savedUser?.address.street).toBe(newAddressName)
  })

  it('should return 400 if update cpf to already existing cpf', async () => {
    const anotherUser = UserFactory.random()
    const createdUser = await userModel.create(anotherUser)
    createdUsersIds.push(createdUser._id)

    const updatedUserData = {
      cpf: anotherUser.cpf
    }

    const { body } = await supertest(server)
      .put(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .send(updatedUserData)
      .expect(400)
    
    expect(body.duplicatedIndexes).toEqual({ cpf: anotherUser.cpf })
  })

  it('should return 400 if try to update email', async () => {
    const anotherUser = UserFactory.random()
    const createdUser = await userModel.create(anotherUser)
    createdUsersIds.push(createdUser._id)

    const updatedUserData = {
      email: anotherUser.email
    }

    await supertest(server)
      .put(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .send(updatedUserData)
      .expect(400)
    
    const savedUser = await userModel.findById(createdUserId)
    expect(savedUser?.email).not.toBe(anotherUser.email)
  })

  it('should return 400 if try to update password', async () => {
    const updatedUserData = {
      password: 'new_password'
    }
    const beforeTryUpdateUser = await userModel.findById(createdUserId)
    await supertest(server)
      .put(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .send(updatedUserData)
      .expect(400)
    const afterTryUpdateUser = await userModel.findById(createdUserId)
      
    expect(beforeTryUpdateUser?.password).toBe(afterTryUpdateUser?.password)
  })

  it('should return 404 if user not found', async () => {
    await userModel.deleteOne({ _id: createdUserId })
    await supertest(server)
      .put(`/users/${createdUserId}`)
      .set('Authorization', bearerToken)
      .send({ name: 'new_name' })
      .expect(404)
  })

  it('should return 403 if a user try to update another user', async () => {
    const anotherUser = UserFactory.random()
    const anotherCreatedUser = await userModel.create(anotherUser)
    createdUsersIds.push(anotherCreatedUser._id)

    await supertest(server)
      .put(`/users/${anotherCreatedUser._id}`)
      .set('Authorization', bearerToken)
      .send({ name: 'new_name' })
      .expect(403)
  })
})