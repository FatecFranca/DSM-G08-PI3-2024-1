import { ZodError } from 'zod'
import { AppError } from './AppError'
import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class BodyValidationError extends AppError {
  _name = 'BodyValidationError'
  errors: any[] = []
  constructor(message: string, errors: any[] = []) {
    super(message, WebStatusCodeEnum.BadRequest)
    this.errors = errors
  }

  static fromZodError(zodError: ZodError) {
    return new this('Body validation error', zodError.errors)
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors
    }
  }
}