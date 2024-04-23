import { AppError } from './AppError'
import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class DuplicatedIndexError extends AppError {
  _name = 'DuplicatedIndexError'
  duplicatedIndexes : string[] = []
  constructor(message: string, duplicatedIndexes: string[] = []) {
    super(message, WebStatusCodeEnum.BadRequest)
    this.duplicatedIndexes = duplicatedIndexes
  }
}