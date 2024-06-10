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
exports.addMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const server_1 = require("../../configs/server");
const AppError_1 = require("../../errors/AppError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const ChatModel_1 = require("../../models/ChatModel");
const zodBodySchema = zod_1.z.object({
    message: zod_1.z.string().trim().min(1).max(1000),
});
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Missing payload in request');
    }
    const { message } = zodBodySchema.parse(req.body);
    const chatId = req.params.chatId;
    const chat = yield ChatModel_1.chatModel.findById(chatId);
    if (!chat) {
        throw new NotFoundError_1.NotFoundError('Chat not found', { id: chatId });
    }
    const notInChat = ![chat.patient.toString(), (_a = chat.attendant) === null || _a === void 0 ? void 0 : _a.toString()].includes(payload.id);
    if (notInChat) {
        throw AppError_1.AppError.forbidden('User not in chat');
    }
    const messageData = {
        message, user: payload.id,
        _id: new mongoose_1.default.Types.ObjectId(),
        sentWhen: new Date(),
    };
    chat.messages.push(messageData);
    chat.markModified('messages');
    yield chat.save();
    server_1.io.to(`chat:${chatId}`).emit('chat.message.created', { chatId, message: messageData });
    return res.status(201).json(messageData);
});
exports.addMessage = addMessage;
