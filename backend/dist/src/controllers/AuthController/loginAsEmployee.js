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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAsEmployee = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const EmployeeModel_1 = require("../../models/EmployeeModel");
const UserModel_1 = require("../../models/UserModel");
const env_1 = require("../../configs/env");
const AppError_1 = require("../../errors/AppError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const zodBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
const loginAsEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = zodBodySchema.parse(req.body);
    const user = yield UserModel_1.userModel.findOne({ email });
    if (!user) {
        throw new NotFoundError_1.NotFoundError('Employee not found', { email });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw AppError_1.AppError.unauthorized('Invalid password');
    }
    const isEmployee = yield EmployeeModel_1.employeeModel.findOne({ user: user._id });
    if (!isEmployee) {
        throw new NotFoundError_1.NotFoundError('Employee not found', { email });
    }
    const payload = {
        id: isEmployee._id,
        role: isEmployee.role,
        name: user.name
    };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: '1d' });
    const decodedPayload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    return res.status(200).json({
        employee: {
            employeeId: isEmployee._id,
            role: isEmployee.role,
            user: user.toJSON()
        },
        token
    });
});
exports.loginAsEmployee = loginAsEmployee;
