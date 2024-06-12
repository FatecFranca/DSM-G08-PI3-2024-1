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
describe('DELETE /users/:id', () => {
    let createdUserId;
    let user;
    let expectedAddress;
    let expectedUser;
    let bearerToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user = user_factory_1.UserFactory.random();
        expectedAddress = Object.assign(Object.assign({}, user.address), { _id: expect.any(String) });
        expectedUser = Object.assign(Object.assign({}, user), { _id: expect.any(String), address: expectedAddress, data_nascimento: user.data_nascimento.toISOString(), healthInfo: expect.objectContaining(user.healthInfo), password: expect.any(String), __v: expect.any(Number) });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send(user);
        createdUserId = body._id;
        const { body: authBody } = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({ email: user.email, password: user.password });
        bearerToken = `Bearer ${authBody.token}`;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.userModel.deleteMany({
            _id: createdUserId
        });
    }));
    it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .delete(`/users/${createdUserId}`)
            .expect(401);
    }));
    it('should return 200 and delete user if authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .delete(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .expect(200);
        const existsUser = yield UserModel_1.userModel.findOne({ _id: createdUserId });
        expect(existsUser).toBeFalsy();
    }));
    it('should return 403 if try to delete another user', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const antherUserData = yield UserModel_1.userModel.create(anotherUser);
        yield (0, supertest_1.default)(server_1.default)
            .delete(`/users/${antherUserData._id}`)
            .set('Authorization', bearerToken)
            .expect(403);
        const anotherUserSaved = yield UserModel_1.userModel.findById(antherUserData._id);
        expect(anotherUserSaved).toBeTruthy();
    }));
});
