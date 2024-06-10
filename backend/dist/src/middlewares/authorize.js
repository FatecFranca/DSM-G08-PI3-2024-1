"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const EmployeeModel_1 = require("../models/EmployeeModel");
const RoleEnum_1 = require("../types/RoleEnum");
const authorize = (authorizationPolicy, authorizeIfHaveNoAdmin = false) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.payload) {
            return res.status(500).json({ message: 'User role not found' });
        }
        if (authorizeIfHaveNoAdmin) {
            const existAdmin = yield EmployeeModel_1.employeeModel.findOne({ role: RoleEnum_1.RoleEnum.ADMIN });
            if (!existAdmin) {
                return next();
            }
        }
        const role = req.payload.role;
        if (!authorizationPolicy.rolesPermited.includes(role)) {
            return res.status(403).json({ message: 'User is not authorized' });
        }
        return next();
    });
};
exports.authorize = authorize;
