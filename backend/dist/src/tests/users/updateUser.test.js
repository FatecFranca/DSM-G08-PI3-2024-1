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
describe('PUT /users/:id', () => {
    let createdUserId;
    let user;
    let expectedAddress;
    let expectedUser;
    let bearerToken;
    let createdUsersIds = [];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user = user_factory_1.UserFactory.random();
        expectedAddress = Object.assign(Object.assign({}, user.address), { _id: expect.any(String) });
        expectedUser = Object.assign(Object.assign({}, user), { _id: expect.any(String), address: expectedAddress, data_nascimento: user.data_nascimento.toISOString(), healthInfo: expect.objectContaining(user.healthInfo), password: expect.any(String), __v: expect.any(Number) });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        createdUsersIds = [];
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
        createdUsersIds.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.userModel.deleteMany({ _id: id });
        }));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.userModel.deleteMany({
            _id: createdUserId
        });
        yield Promise.all(createdUsersIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.userModel.deleteMany({ _id: id });
        })));
    }));
    it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .send(user)
            .expect(401);
    }));
    it('should return 200 and updated user when pass correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const newName = 'new_name';
        const newAddressName = 'new_street';
        const updatedUser = {
            name: newName,
            address: Object.assign(Object.assign({}, user.address), { street: newAddressName })
        };
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .send(updatedUser)
            .expect(200);
        const savedUser = yield UserModel_1.userModel.findById(createdUserId);
        expect(savedUser).toBeTruthy();
        expect(body).toEqual(Object.assign(Object.assign({}, expectedUser), { name: newName, address: Object.assign(Object.assign({}, expectedAddress), { street: newAddressName }) }));
        expect(savedUser === null || savedUser === void 0 ? void 0 : savedUser.name).toBe(newName);
        expect(savedUser === null || savedUser === void 0 ? void 0 : savedUser.address.street).toBe(newAddressName);
    }));
    it('should return 400 if update cpf to already existing cpf', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const createdUser = yield UserModel_1.userModel.create(anotherUser);
        createdUsersIds.push(createdUser._id);
        const updatedUserData = {
            cpf: anotherUser.cpf
        };
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .send(updatedUserData)
            .expect(400);
        expect(body.duplicatedIndexes).toEqual({ cpf: anotherUser.cpf });
    }));
    it('should return 400 if try to update email', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const createdUser = yield UserModel_1.userModel.create(anotherUser);
        createdUsersIds.push(createdUser._id);
        const updatedUserData = {
            email: anotherUser.email
        };
        yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .send(updatedUserData)
            .expect(400);
        const savedUser = yield UserModel_1.userModel.findById(createdUserId);
        expect(savedUser === null || savedUser === void 0 ? void 0 : savedUser.email).not.toBe(anotherUser.email);
    }));
    it('should return 400 if try to update password', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUserData = {
            password: 'new_password'
        };
        const beforeTryUpdateUser = yield UserModel_1.userModel.findById(createdUserId);
        yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .send(updatedUserData)
            .expect(400);
        const afterTryUpdateUser = yield UserModel_1.userModel.findById(createdUserId);
        expect(beforeTryUpdateUser === null || beforeTryUpdateUser === void 0 ? void 0 : beforeTryUpdateUser.password).toBe(afterTryUpdateUser === null || afterTryUpdateUser === void 0 ? void 0 : afterTryUpdateUser.password);
    }));
    it('should return 404 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.userModel.deleteOne({ _id: createdUserId });
        yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${createdUserId}`)
            .set('Authorization', bearerToken)
            .send({ name: 'new_name' })
            .expect(404);
    }));
    it('should return 403 if a user try to update another user', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const anotherCreatedUser = yield UserModel_1.userModel.create(anotherUser);
        createdUsersIds.push(anotherCreatedUser._id);
        yield (0, supertest_1.default)(server_1.default)
            .put(`/users/${anotherCreatedUser._id}`)
            .set('Authorization', bearerToken)
            .send({ name: 'new_name' })
            .expect(403);
    }));
});
