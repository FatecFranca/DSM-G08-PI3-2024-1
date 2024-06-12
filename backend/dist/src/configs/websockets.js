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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ChatModel_1 = require("../models/ChatModel");
const RoleEnum_1 = require("../types/RoleEnum");
const env_1 = require("./env");
const server_1 = require("./server");
const validToken = (bearerToken) => {
    const [bearer, token] = bearerToken.split(' ');
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    return payload;
};
//TODO: Intead of save only the rooms. Save sockets infos like userId and role.
//TODO: Works more like saga. Where chat has a saga like created, sent, error, received
const socketRooms = {};
server_1.io.on('connection', (socket) => {
    socket.on('chat.enter', (_a, ack_1) => __awaiter(void 0, [_a, ack_1], void 0, function* ({ token, chatId }, ack) {
        var _b;
        let payload;
        try {
            payload = validToken(token);
        }
        catch (error) {
            console.log('Invalid token');
            return ack({
                message: 'Invalid token',
                status: 401
            });
        }
        const chat = yield ChatModel_1.chatModel.findById(chatId);
        if (!chat) {
            console.log('Chat not found');
            return ack({
                message: 'Chat not found',
                status: 404
            });
        }
        const inChat = userInChat(chat.patient.toString(), (_b = chat.attendant) === null || _b === void 0 ? void 0 : _b.toString(), payload);
        if (!inChat) {
            console.log('User not in chat');
            return ack({
                message: 'User not in chat',
                status: 401
            });
        }
        if (!socketRooms[socket.id]) {
            socketRooms[socket.id] = [];
        }
        socketRooms[socket.id].push(`chat:${chatId}`);
        socket.join(`chat:${chatId}`);
        return ack({
            chat: chat.toJSON(),
            status: 200
        });
    }));
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        const rooms = socketRooms[socket.id];
        if (rooms) {
            const promises = rooms.map(room => {
                return socket.leave(room);
            });
            yield Promise.all(promises);
        }
    }));
});
function userInChat(patient, attendant, payload) {
    let inChat = false;
    if (payload.role === RoleEnum_1.RoleEnum.USER) {
        inChat = patient === payload.id;
    }
    else if (payload.role === RoleEnum_1.RoleEnum.EMPLOYEE) {
        inChat = attendant === payload.id;
    }
    return inChat;
}
