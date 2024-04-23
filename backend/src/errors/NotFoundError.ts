import { AppError } from './AppError'
import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class NotFoundError extends AppError {
  _name = 'NotFoundError'
  queryParams: string[] = []

  constructor(message: string, queryParams: string[] = []) {
    super(message, WebStatusCodeEnum.NotFound)
    this.queryParams = queryParams
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      queryParams: this.queryParams
    }
  }
}