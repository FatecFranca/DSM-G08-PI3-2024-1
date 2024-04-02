import { RoleEnum } from './RoleEnum'

export class AuthorizationPolicy {
  rolesPermited: RoleEnum[]

  constructor(rolesPermited: RoleEnum[]) {
    this.rolesPermited = rolesPermited
  }

  static onlyUsers() {
    return new AuthorizationPolicy([RoleEnum.USER])
  }

  static allEmployees() {
    return new AuthorizationPolicy([RoleEnum.ADMIN, RoleEnum.EMPLOYEE])
  }
  
  static onlyAdmin() {
    return new AuthorizationPolicy([RoleEnum.ADMIN])
  }
}