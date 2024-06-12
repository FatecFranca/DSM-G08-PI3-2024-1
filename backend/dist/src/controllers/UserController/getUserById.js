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
exports.getUserById = void 0;
const AppError_1 = require("../../errors/AppError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const UserModel_1 = require("../../models/UserModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Payload not found');
    }
    const isNotEmployee = ![RoleEnum_1.RoleEnum.ADMIN, RoleEnum_1.RoleEnum.EMPLOYEE].includes(payload.role);
    if (isNotEmployee && payload.id !== req.params.id) {
        throw AppError_1.AppError.forbidden('You are not allowed to access this resource');
    }
    const { id } = req.params;
    const user = yield UserModel_1.userModel.findById(id);
    if (!user) {
        throw new NotFoundError_1.NotFoundError('User not found', { id });
    }
    return res.json(user);
});
exports.getUserById = getUserById;
