import { AppError } from './AppError'
import { WebStatusCodeEnum } from './WebStatusCodeEnum'

export class DuplicatedIndexError extends AppError {
  _name = 'DuplicatedIndexError'
  duplicatedIndexes : Record<string, number|string> = {}

  constructor(message: string, duplicatedIndexes: Record<string, number|string> = {}) {
    if (Object.values(duplicatedIndexes).length === 0) throw new Error('DuplicatedIndexError must have at least one duplicated index')

    super(message, WebStatusCodeEnum.BadRequest)
    this.duplicatedIndexes = duplicatedIndexes
  }

  static fromDuplicatedIndexesOfEntity(duplicatedIndexes: DuplicatedIndexError['duplicatedIndexes'], entityName: string) {
    const indexes = Object.keys(duplicatedIndexes)
    if (indexes.length === 0) throw new Error('DuplicatedIndexError must have at least one duplicated index')
      
    let message: string
    if (indexes.length === 1) {
      message = `Already exists ${entityName.toLocaleLowerCase()} with ${indexes[0]}`
    } else {
      const firstPart = indexes.splice(0, indexes.length - 1)
      message = `Already exists ${entityName.toLocaleLowerCase()} with ${firstPart.join(', ')} and ${indexes[0]}`
    }

    return new this(message, duplicatedIndexes)
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duplicatedIndexes: this.duplicatedIndexes
    }
  }
}