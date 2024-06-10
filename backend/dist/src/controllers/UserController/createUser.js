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
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = require("../../models/UserModel");
const DuplicatedIndexError_1 = require("../../errors/DuplicatedIndexError");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    const userData = UserModel_1.zodUserSchema.omit({
        _id: true
    }).parse(req.body);
    const existsUserWithEmail = !!(yield UserModel_1.userModel.findOne({
        email: userData.email
    }));
    const existsUserWithCpf = !!(yield UserModel_1.userModel.findOne({
        cpf: userData.cpf
    }));
    if (existsUserWithEmail || existsUserWithCpf) {
        const duplicatedIndexes = Object.assign(Object.assign({}, (existsUserWithEmail && { email: userData.email })), (existsUserWithCpf && { cpf: userData.cpf }));
        throw DuplicatedIndexError_1.DuplicatedIndexError.fromDuplicatedIndexesOfEntity(duplicatedIndexes, 'User');
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
    const newUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    return res.status(201).json(newUser);
});
exports.createUser = createUser;
