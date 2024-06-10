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
exports.createEmployee = void 0;
const zod_1 = require("zod");
const EmployeeModel_1 = require("../../models/EmployeeModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const mongoose_1 = require("mongoose");
const UserModel_1 = require("../../models/UserModel");
const NotFoundError_1 = require("../../errors/NotFoundError");
const AppError_1 = require("../../errors/AppError");
const zodCreateEmployeeBodySchema = zod_1.z.object({
    userId: zod_1.z.string().refine(mongoose_1.Types.ObjectId.isValid, { message: 'Invalid user id' }),
    role: zod_1.z.union([zod_1.z.literal(RoleEnum_1.RoleEnum.ADMIN), zod_1.z.literal(RoleEnum_1.RoleEnum.EMPLOYEE)])
});
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = zodCreateEmployeeBodySchema.parse(req.body);
    if (role === RoleEnum_1.RoleEnum.ADMIN) {
        const existAdmin = yield EmployeeModel_1.employeeModel.findOne({ role: RoleEnum_1.RoleEnum.ADMIN });
        if (existAdmin) {
            throw AppError_1.AppError.forbidden('Admin already exists');
        }
    }
    const existUser = yield UserModel_1.userModel.findById(userId);
    if (!existUser) {
        throw new NotFoundError_1.NotFoundError('User not found', { userId });
    }
    const employee = yield EmployeeModel_1.employeeModel.create({ user: userId, role });
    return res.status(201).json(employee);
});
exports.createEmployee = createEmployee;
