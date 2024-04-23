import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class AppError extends Error {
  protected _name: string = 'AppError'
  public readonly message: string
  public readonly statusCode: number

  constructor(message: string, statusCode: WebStatusCodeEnum = WebStatusCodeEnum.BadRequest) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }

  static internalServerError(message: string) {
    return new this(message, WebStatusCodeEnum.InternalServerError)
  }

  static unauthorized(message: string) {
    return new this(message, WebStatusCodeEnum.Unauthorized)
  }

  static forbidden(message: string) {
    return new this(message, WebStatusCodeEnum.Forbidden)
  }

  toJSON() {
    return {
      errorName: this.name,
      message: this.message
    }
  }

  get name() {
    return this._name
  }
}