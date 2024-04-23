import { AppError } from './AppError'
import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class NotFoundError extends AppError {
  _name = 'NotFoundError'
  queryParams: Record<string, string|number> = {}

  constructor(message: string, queryParams: Record<string, string|number>) {
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