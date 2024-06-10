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
exports.createChat = void 0;
const AppError_1 = require("../../errors/AppError");
const ChatModel_1 = require("../../models/ChatModel");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.payload;
    if (!payload) {
        throw AppError_1.AppError.internalServerError('Missing payload in request');
    }
    const patient = payload.id;
    const newChat = yield ChatModel_1.chatModel.create({
        patient,
        messages: [],
    });
    return res.status(201).json(newChat);
});
exports.createChat = createChat;
