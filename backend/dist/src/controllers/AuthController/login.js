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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const env_1 = require("../../configs/env");
const UserModel_1 = require("../../models/UserModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const NotFoundError_1 = require("../../errors/NotFoundError");
const AppError_1 = require("../../errors/AppError");
const loginBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginBodySchema.parse(req.body);
    const user = yield UserModel_1.userModel.findOne({
        email
    });
    if (!user) {
        throw new NotFoundError_1.NotFoundError('User not found', { email });
    }
    const isValidPassword = bcrypt_1.default.compareSync(password, user.password);
    if (!isValidPassword) {
        throw AppError_1.AppError.unauthorized('Invalid password');
    }
    const token = yield jsonwebtoken_1.default.sign({ id: user._id, role: RoleEnum_1.RoleEnum.USER, name: user.name }, env_1.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
        token,
        user
    });
});
exports.login = login;
