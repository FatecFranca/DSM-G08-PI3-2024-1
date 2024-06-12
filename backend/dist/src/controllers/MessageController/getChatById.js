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
exports.getChatById = void 0;
const ChatModel_1 = require("../../models/ChatModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const AppError_1 = require("../../errors/AppError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const getChatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //@ts-ignore
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Missing payload in request');
    }
    const chatId = req.params.chatId;
    const chat = yield ChatModel_1.chatModel.findById(chatId);
    if (!chat) {
        throw new NotFoundError_1.NotFoundError('Chat not found', { id: chatId });
    }
    const isNotAdmin = payload.role !== RoleEnum_1.RoleEnum.ADMIN;
    const isNotInChat = ![chat.patient.toString(), (_a = chat.attendant) === null || _a === void 0 ? void 0 : _a.toString()].includes(payload.id);
    if (isNotAdmin && isNotInChat) {
        throw AppError_1.AppError.forbidden('Forbidden access to chat');
    }
    return res.status(200).json(chat);
});
exports.getChatById = getChatById;
