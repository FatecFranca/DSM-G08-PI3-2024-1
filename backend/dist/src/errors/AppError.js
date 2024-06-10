"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const WebStatusCodeEnum_1 = require("./WebStatusCodeEnum");
class AppError extends Error {
    constructor(message, statusCode = WebStatusCodeEnum_1.WebStatusCodeEnum.BadRequest) {
        super(message);
        this._name = 'AppError';
        this.message = message;
        this.statusCode = statusCode;
    }
    static internalServerError(message) {
        return new this(message, WebStatusCodeEnum_1.WebStatusCodeEnum.InternalServerError);
    }
    static unauthorized(message) {
        return new this(message, WebStatusCodeEnum_1.WebStatusCodeEnum.Unauthorized);
    }
    static forbidden(message) {
        return new this(message, WebStatusCodeEnum_1.WebStatusCodeEnum.Forbidden);
    }
    toJSON() {
        return {
            errorName: this.name,
            message: this.message
        };
    }
    get name() {
        return this._name;
    }
}
exports.AppError = AppError;
