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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../configs/server"));
const UserModel_1 = require("../../models/UserModel");
const user_factory_1 = require("../utils/user-factory");
describe('POST /users', () => {
    let user;
    let expectedAddress;
    let expectedUser;
    const createdUsersIds = new Set();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user = user_factory_1.UserFactory.random();
        expectedAddress = Object.assign(Object.assign({}, user.address), { _id: expect.any(String) });
        expectedUser = Object.assign(Object.assign({}, user), { _id: expect.any(String), address: expectedAddress, data_nascimento: user.data_nascimento.toISOString(), healthInfo: expect.objectContaining(user.healthInfo), password: expect.any(String), __v: expect.any(Number) });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        for (const id of createdUsersIds) {
            yield UserModel_1.userModel.deleteMany({ _id: id });
        }
    }));
    it('should return status 201 and created user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(201);
        createdUsersIds.add(response.body._id);
        const savedUser = yield UserModel_1.userModel.findById(response.body._id);
        expect(savedUser).toBeTruthy();
        expect(response.body).toEqual(expectedUser);
    }));
    it('should return 201 and create user even if healthInfo is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        delete user.healthInfo;
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(201);
        createdUsersIds.add(body._id);
        const savedUser = yield UserModel_1.userModel.findById(body._id);
        expect(savedUser).toBeTruthy();
    }));
    it('should not save user password as plain text', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(201);
        createdUsersIds.add(body._id);
        const savedUser = yield UserModel_1.userModel.findById(body._id);
        expect(savedUser).toBeTruthy();
        expect(savedUser === null || savedUser === void 0 ? void 0 : savedUser.password).not.toBe(user.password);
    }));
    it('should return 400 if pass invalid cpf data type', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(Object.assign(Object.assign({}, user), { cpf: '123.456.789-96' }))
            .expect(400);
    }));
    it('should return 400 if pass invalid email data type', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(Object.assign(Object.assign({}, user), { email: 'invalid-email' }))
            .expect(400);
    }));
    it('should return 400 if already exists a user with this email', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const existentUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, anotherUser), { email: user.email }));
        createdUsersIds.add(existentUser._id.toString());
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(400);
        expect(body.duplicatedIndexes).toEqual({ email: user.email });
        expect(body.message.toLocaleLowerCase()).toContain('email');
    }));
    it('should return 400 if already exists a user with this cpf', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const existentUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, anotherUser), { cpf: user.cpf }));
        createdUsersIds.add(existentUser._id.toString());
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(400);
        expect(body.duplicatedIndexes).toEqual({ cpf: user.cpf });
        expect(body.message.toLocaleLowerCase()).toContain('cpf');
    }));
    it('should return 400 if alread exists a user with this email and cpf', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const existentUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, anotherUser), { email: user.email, cpf: user.cpf }));
        createdUsersIds.add(existentUser._id.toString());
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user)
            .expect(400);
        expect(body.duplicatedIndexes).toEqual({ email: user.email, cpf: user.cpf });
        expect(body.message.toLocaleLowerCase()).toContain('email');
        expect(body.message.toLocaleLowerCase()).toContain('cpf');
    }));
});
