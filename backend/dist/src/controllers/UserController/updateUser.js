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
exports.updateUser = void 0;
const DuplicatedIndexError_1 = require("../../errors/DuplicatedIndexError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const UserModel_1 = require("../../models/UserModel");
const zod_1 = require("zod");
const AppError_1 = require("../../errors/AppError");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Payload not found in request');
    }
    if (payload.id !== req.params.id) {
        throw AppError_1.AppError.forbidden('You can only update your own user');
    }
    const { id } = req.params;
    const userData = UserModel_1.zodUserSchema.partial().extend({
        _id: zod_1.z.undefined(),
        password: zod_1.z.undefined(),
        email: zod_1.z.undefined(),
    }).parse(req.body);
    const savedUser = yield UserModel_1.userModel.findById(id);
    if (!savedUser) {
        throw new NotFoundError_1.NotFoundError('User not found', { id });
    }
    const isCpfDifferent = userData.cpf && (savedUser.cpf !== userData.cpf);
    if (isCpfDifferent) {
        const existsUserWithCpf = yield UserModel_1.userModel.findOne({
            cpf: userData.cpf
        });
        if (existsUserWithCpf) {
            throw DuplicatedIndexError_1.DuplicatedIndexError.fromDuplicatedIndexesOfEntity({ cpf: userData.cpf }, 'User');
        }
    }
    yield UserModel_1.userModel.updateOne({
        _id: id
    }, Object.assign({}, userData));
    const updatedUser = yield UserModel_1.userModel.findById(id);
    return res.status(200).json(updatedUser);
});
exports.updateUser = updateUser;
