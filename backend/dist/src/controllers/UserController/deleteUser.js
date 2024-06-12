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
exports.deleteUser = void 0;
const UserModel_1 = require("../../models/UserModel");
const AppError_1 = require("../../errors/AppError");
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Payload should be on request');
    }
    const { id } = req.params;
    if (payload.id !== id) {
        throw AppError_1.AppError.forbidden('You are not allowed to delete the resource');
    }
    yield UserModel_1.userModel.deleteOne({ _id: id });
    res.status(200).json({ message: 'User deleted successfully' });
});
exports.deleteUser = deleteUser;
