"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatedIndexError = void 0;
const AppError_1 = require("./AppError");
const WebStatusCodeEnum_1 = require("./WebStatusCodeEnum");
class DuplicatedIndexError extends AppError_1.AppError {
    constructor(message, duplicatedIndexes = {}) {
        if (Object.values(duplicatedIndexes).length === 0)
            throw new Error('DuplicatedIndexError must have at least one duplicated index');
        super(message, WebStatusCodeEnum_1.WebStatusCodeEnum.BadRequest);
        this._name = 'DuplicatedIndexError';
        this.duplicatedIndexes = {};
        this.duplicatedIndexes = duplicatedIndexes;
    }
    static fromDuplicatedIndexesOfEntity(duplicatedIndexes, entityName) {
        const indexes = Object.keys(duplicatedIndexes);
        if (indexes.length === 0)
            throw new Error('DuplicatedIndexError must have at least one duplicated index');
        let message;
        if (indexes.length === 1) {
            message = `Already exists ${entityName.toLocaleLowerCase()} with ${indexes[0]}`;
        }
        else {
            const firstPart = indexes.splice(0, indexes.length - 1);
            message = `Already exists ${entityName.toLocaleLowerCase()} with ${firstPart.join(', ')} and ${indexes[0]}`;
        }
        return new this(message, duplicatedIndexes);
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { duplicatedIndexes: this.duplicatedIndexes });
    }
}
exports.DuplicatedIndexError = DuplicatedIndexError;
