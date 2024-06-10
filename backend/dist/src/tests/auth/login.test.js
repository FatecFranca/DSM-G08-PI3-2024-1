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
const UserModel_1 = require("../../models/UserModel");
const user_factory_1 = require("../utils/user-factory");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../configs/server"));
describe('POST /auth/login', () => {
    let createdUserId;
    let user;
    let expectedAddress;
    let expectedUser;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user = user_factory_1.UserFactory.random();
        expectedAddress = Object.assign(Object.assign({}, user.address), { _id: expect.any(String) });
        expectedUser = Object.assign(Object.assign({}, user), { _id: expect.any(String), address: expectedAddress, data_nascimento: user.data_nascimento.toISOString(), healthInfo: expect.objectContaining(user.healthInfo), password: expect.any(String), __v: expect.any(Number) });
        const createdUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, user), { password: bcrypt_1.default.hashSync(user.password, 10) }));
        createdUserId = createdUser._id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.userModel.deleteMany({
            _id: createdUserId
        });
    }));
    it('should return 400 if do not pass email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            password: user.password
        })
            .expect(400);
    }));
    it('should return 400 if do not pass password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: user.email
        })
            .expect(400);
    }));
    it('should return 400 if do not pass body', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .expect(400);
    }));
    it('should return 404 if user with email does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: 'any@email.com',
            password: 'any_password'
        })
            .expect(404);
    }));
    it('should return 401 if pass incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: user.email,
            password: 'incorrect_password'
        })
            .expect(401);
    }));
    it('should return 200 if pass correct credentials and body should contain token and user data', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: user.email,
            password: user.password
        })
            .expect(200);
        expect(body.token).toBeTruthy();
        expect(body.user).toBeTruthy();
        expect(body.user._id).toBe(createdUserId.toString());
    }));
});
