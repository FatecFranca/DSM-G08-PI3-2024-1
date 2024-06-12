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
exports.getChatsByUser = void 0;
const ChatModel_1 = require("../../models/ChatModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const AppError_1 = require("../../errors/AppError");
const getChatsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Missing payload in request');
    }
    const userId = req.params.userId;
    const chats = yield ChatModel_1.chatModel.find({ patient: userId });
    const isEmployee = payload.role !== RoleEnum_1.RoleEnum.USER;
    const isNotAuthorized = payload.id !== userId;
    if (isEmployee && isNotAuthorized) {
        throw AppError_1.AppError.forbidden('Forbidden access to chats');
    }
    return res.status(200).json(chats);
});
exports.getChatsByUser = getChatsByUser;
