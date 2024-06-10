"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyValidationError = void 0;
const AppError_1 = require("./AppError");
const WebStatusCodeEnum_1 = require("./WebStatusCodeEnum");
class BodyValidationError extends AppError_1.AppError {
    constructor(message, errors = []) {
        super(message, WebStatusCodeEnum_1.WebStatusCodeEnum.BadRequest);
        this._name = 'BodyValidationError';
        this.errors = [];
        this.errors = errors;
    }
    static fromZodError(zodError) {
        return new this('Body validation error', zodError.errors);
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { errors: this.errors });
    }
}
exports.BodyValidationError = BodyValidationError;
