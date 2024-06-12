"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeModel = exports.zodEmployeeSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const RoleEnum_1 = require("../types/RoleEnum");
exports.zodEmployeeSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongoose_1.default.Types.ObjectId).optional(),
    user: zod_1.z.instanceof(mongoose_1.default.Types.ObjectId),
    role: zod_1.z.nativeEnum(RoleEnum_1.RoleEnum)
});
const EmployeeSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true,
        default: RoleEnum_1.RoleEnum.EMPLOYEE
    },
});
exports.employeeModel = mongoose_1.default.model('Employee', EmployeeSchema);
