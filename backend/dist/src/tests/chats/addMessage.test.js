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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const socket_io_client_1 = require("socket.io-client");
const supertest_1 = __importDefault(require("supertest"));
const env_1 = require("../../configs/env");
const server_1 = __importDefault(require("../../configs/server"));
require("../../configs/websockets");
const ChatModel_1 = require("../../models/ChatModel");
const EmployeeModel_1 = require("../../models/EmployeeModel");
const UserModel_1 = require("../../models/UserModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const user_factory_1 = require("../utils/user-factory");
function waitOnce(socket, event) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}
function waitEmitAck(socket, event, data) {
    return new Promise((resolve) => {
        socket.emit(event, data, resolve);
    });
}
function connectServer() {
    return new Promise((resolve) => {
        server_1.default.listen(env_1.env.PORT, () => {
            const clientSocket = (0, socket_io_client_1.io)(`http://localhost:${env_1.env.PORT}`);
            clientSocket.on('connect', () => {
                resolve(clientSocket);
            });
        });
    });
}
function produceSocketClient() {
    return new Promise((resolve) => {
        const clientSocket = (0, socket_io_client_1.io)(`http://localhost:${env_1.env.PORT}`);
        clientSocket.on('connect', () => {
            resolve(clientSocket);
        });
    });
}
describe('POST /chats/:chatId/messages', () => {
    let patientClientSocket;
    let employeeClientSocker;
    let admin;
    let user;
    let employee;
    let createdUsersIds = [];
    let createdEmployeesIds = [];
    let chatId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        createdUsersIds = [];
        createdEmployeesIds = [];
        const employeeUser = user_factory_1.UserFactory.random();
        const adminUser = user_factory_1.UserFactory.random();
        const anotherUser = user_factory_1.UserFactory.random();
        const [createEmployeeUser, createAdminUser, createUser] = yield Promise.all([
            UserModel_1.userModel.create(Object.assign(Object.assign({}, employeeUser), { password: bcrypt_1.default.hashSync(employeeUser.password, 10) })),
            UserModel_1.userModel.create(Object.assign(Object.assign({}, adminUser), { password: bcrypt_1.default.hashSync(adminUser.password, 10) })),
            UserModel_1.userModel.create(Object.assign(Object.assign({}, anotherUser), { password: bcrypt_1.default.hashSync(anotherUser.password, 10) }))
        ]);
        const [employeeData, adminData] = yield Promise.all([
            EmployeeModel_1.employeeModel.create({
                user: createEmployeeUser._id,
                role: RoleEnum_1.RoleEnum.EMPLOYEE
            }),
            EmployeeModel_1.employeeModel.create({
                user: createAdminUser._id,
                role: RoleEnum_1.RoleEnum.ADMIN
            })
        ]);
        const [employeeAuthResponse, adminAuthResponse, userAuthResponse] = yield Promise.all([
            (0, supertest_1.default)(server_1.default).post('/auth/login-employee').send({ email: employeeUser.email, password: employeeUser.password }).expect(200),
            (0, supertest_1.default)(server_1.default).post('/auth/login-employee').send({ email: adminUser.email, password: adminUser.password }).expect(200),
            (0, supertest_1.default)(server_1.default).post('/auth/login').send({ email: anotherUser.email, password: anotherUser.password }).expect(200)
        ]);
        employee = {
            _id: employeeData._id,
            bearerToken: 'Bearer ' + employeeAuthResponse.body.token,
            user: createEmployeeUser.toJSON()
        };
        admin = {
            _id: adminData._id,
            bearerToken: 'Bearer ' + adminAuthResponse.body.token,
            user: createAdminUser.toJSON()
        };
        user = {
            _id: createUser._id,
            bearerToken: 'Bearer ' + userAuthResponse.body.token,
            user: createUser.toJSON()
        };
        yield new Promise((resolve, reject) => {
            try {
                server_1.default.listen(env_1.env.PORT, () => resolve(''));
            }
            catch (error) {
                reject(error);
            }
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server_1.default.close();
        yield Promise.all([
            EmployeeModel_1.employeeModel.findByIdAndDelete(employee._id),
            EmployeeModel_1.employeeModel.findByIdAndDelete(admin._id)
        ]);
        yield Promise.all([
            UserModel_1.userModel.findByIdAndDelete(employee.user._id),
            UserModel_1.userModel.findByIdAndDelete(admin.user._id),
            UserModel_1.userModel.findByIdAndDelete(user.user._id)
        ]);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdChat = yield ChatModel_1.chatModel.create({
            patient: user._id,
            attendant: employee._id,
            messages: [],
        });
        chatId = createdChat._id;
        patientClientSocket = yield produceSocketClient();
        employeeClientSocker = yield produceSocketClient();
        const response = yield waitEmitAck(patientClientSocket, 'chat.enter', {
            token: user.bearerToken,
            chatId: chatId.toString()
        });
        const response2 = yield waitEmitAck(employeeClientSocker, 'chat.enter', {
            token: employee.bearerToken,
            chatId: chatId.toString()
        });
        if (response.status !== 200 || response2.status !== 200) {
            throw [response, response2];
        }
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield patientClientSocket.close();
        yield employeeClientSocker.close();
        yield ChatModel_1.chatModel.findOneAndDelete({
            _id: chatId
        });
        yield Promise.all(createdEmployeesIds.map((id) => __awaiter(void 0, void 0, void 0, function* () { return UserModel_1.userModel.findByIdAndDelete(id); })));
        yield Promise.all(createdUsersIds.map((id) => __awaiter(void 0, void 0, void 0, function* () { return UserModel_1.userModel.findByIdAndDelete(id); })));
    }));
    it('should return 201 when user is authenticated and pass correct params and body', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            message: 'Hello'
        };
        const waitOncePromise = waitOnce(patientClientSocket, 'chat.message.created');
        const waitOncePromiseEmployee = waitOnce(employeeClientSocker, 'chat.message.created');
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post(`/chats/${chatId}/messages`)
            .set('Authorization', user.bearerToken)
            .send(message)
            .expect(201);
        const expectedMessage = {
            message: message.message,
            user: user._id.toString(),
            _id: expect.any(String),
            sentWhen: expect.any(String),
        };
        const messageAdded = yield waitOncePromise;
        const employeeMessageReceived = yield waitOncePromiseEmployee;
        expect(body).toEqual(expectedMessage);
        expect(messageAdded).toEqual({
            chatId: chatId.toString(),
            message: expectedMessage
        });
        expect(employeeMessageReceived).toEqual({
            chatId: chatId.toString(),
            message: expectedMessage
        });
    }));
    it('should return 400 if do not pass message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post(`/chats/${chatId}/messages`)
            .set('Authorization', user.bearerToken)
            .expect(400);
    }));
    it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post(`/chats/${chatId}/messages`)
            .send({ message: 'Hello' })
            .expect(401);
    }));
    it('should return 404 if chat not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherId = new mongoose_1.Types.ObjectId();
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post(`/chats/${anotherId}/messages`)
            .set('Authorization', user.bearerToken)
            .send({ message: 'Hello' })
            .expect(404);
        expect(body.queryParams).toEqual({ id: anotherId.toString() });
    }));
});
