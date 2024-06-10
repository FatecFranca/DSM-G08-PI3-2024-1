"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const AppError_1 = require("./AppError");
const WebStatusCodeEnum_1 = require("./WebStatusCodeEnum");
class NotFoundError extends AppError_1.AppError {
    constructor(message, queryParams) {
        super(message, WebStatusCodeEnum_1.WebStatusCodeEnum.NotFound);
        this._name = 'NotFoundError';
        this.queryParams = {};
        this.queryParams = queryParams;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { queryParams: this.queryParams });
    }
}
exports.NotFoundError = NotFoundError;
