import { Faker, pt_BR, fakerEN_US } from '@faker-js/faker'
import { generate } from '@fnando/cpf'
import { User } from '../../models/UserModel'

const fakerBR = new Faker({
  locale: [pt_BR]
})

const defaultUserProps: User = {
  name: 'any_name',
  lastName: 'any_last_name',
  email: 'any@email.com',
  cpf: generate(true),
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

export class UserFactory {
  private user = { ...defaultUserProps }

  with(overrides: Partial<User>) {
    this.user = { ...this.user, ...overrides }
    return this
  }

  healthInfoWith(overrides: Partial<User['healthInfo']>) {
    this.user.healthInfo = { ...this.user.healthInfo, ...overrides }
    return this
  }

  addressWith(overrides: Partial<User['address']>) {
    this.user.address = { ...this.user.address, ...overrides }
    return this
  }

  withoutHealthInfo() {
    delete this.user.healthInfo
    return this
  }

  build(): User {
    return this.user
  }

  randomize() {
    const fakePerson = fakerBR.person
    return this.with({
      name: fakePerson.firstName(),
      lastName: fakePerson.lastName(),
      cpf: generate(true),
      data_nascimento: fakerBR.date.birthdate(),
      email: fakerBR.internet.email(),
      gender: fakerEN_US.person.gender() === 'female'? 'F' : 'M',
      password: fakerBR.internet.password(),
    })
  }
  
  static random(): User {
    return new UserFactory().randomize().build()
  }

  static randomList(size: number): User[] {
    return Array.from({ length: size }, () => UserFactory.random())
  }
}