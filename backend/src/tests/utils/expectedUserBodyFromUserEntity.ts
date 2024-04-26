import { User } from '../../models/UserModel'

export function expectedUserBodyFromUserEntity(user: User) {
  const expectedAddress = {
    ...user.address,
    _id: expect.any(String)
  }

  const expectedUser = {
    ...user,
    _id: expect.any(String),
    address: expectedAddress,
    data_nascimento: user.data_nascimento.toISOString(),
    healthInfo: {
      ...user.healthInfo,
      _id: expect.any(String)
    },
    password: expect.any(String),
    __v: expect.any(Number)
  }

  return { expectedAddress, expectedUser }
}