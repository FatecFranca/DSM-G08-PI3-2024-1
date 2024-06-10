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
exports.getChats = void 0;
const ChatModel_1 = require("../../models/ChatModel");
//TODO: Implement query search to find chats without attendant
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield ChatModel_1.chatModel.find().populate('patient');
    return res.status(200).json(chats);
});
exports.getChats = getChats;
