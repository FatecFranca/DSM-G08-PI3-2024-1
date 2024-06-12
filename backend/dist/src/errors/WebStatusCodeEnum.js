"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebStatusCodeEnum = void 0;
var WebStatusCodeEnum;
(function (WebStatusCodeEnum) {
    WebStatusCodeEnum[WebStatusCodeEnum["BadRequest"] = 400] = "BadRequest";
    WebStatusCodeEnum[WebStatusCodeEnum["Unauthorized"] = 401] = "Unauthorized";
    WebStatusCodeEnum[WebStatusCodeEnum["Forbidden"] = 403] = "Forbidden";
    WebStatusCodeEnum[WebStatusCodeEnum["NotFound"] = 404] = "NotFound";
    WebStatusCodeEnum[WebStatusCodeEnum["InternalServerError"] = 500] = "InternalServerError";
})(WebStatusCodeEnum || (exports.WebStatusCodeEnum = WebStatusCodeEnum = {}));
