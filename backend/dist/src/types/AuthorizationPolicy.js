"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationPolicy = void 0;
const RoleEnum_1 = require("./RoleEnum");
class AuthorizationPolicy {
    constructor(rolesPermited) {
        this.rolesPermited = rolesPermited;
    }
    static onlyUsers() {
        return new AuthorizationPolicy([RoleEnum_1.RoleEnum.USER]);
    }
    static allEmployees() {
        return new AuthorizationPolicy([RoleEnum_1.RoleEnum.ADMIN, RoleEnum_1.RoleEnum.EMPLOYEE]);
    }
    static onlyAdmin() {
        return new AuthorizationPolicy([RoleEnum_1.RoleEnum.ADMIN]);
    }
}
exports.AuthorizationPolicy = AuthorizationPolicy;
