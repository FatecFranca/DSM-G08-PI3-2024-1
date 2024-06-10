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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../configs/server"));
const EmployeeModel_1 = require("../../models/EmployeeModel");
const UserModel_1 = require("../../models/UserModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const expectedUserBodyFromUserEntity_1 = require("../utils/expectedUserBodyFromUserEntity");
const user_factory_1 = require("../utils/user-factory");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//TODO: Has some colateral effects that make the test fail sometimes. Find out later why. Try to isolate the test by deleting only the created resources
describe('POST /auth/login-employee', () => {
    let employee;
    let admin;
    let createdUsersIds = [];
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        createdUsersIds = [];
        const employeeUser = user_factory_1.UserFactory.random();
        const adminUser = user_factory_1.UserFactory.random();
        const [createEmployeeUser, createAdminUser] = yield Promise.all([
            UserModel_1.userModel.create(Object.assign(Object.assign({}, employeeUser), { password: bcrypt_1.default.hashSync(employeeUser.password, 10) })),
            UserModel_1.userModel.create(Object.assign(Object.assign({}, adminUser), { password: bcrypt_1.default.hashSync(adminUser.password, 10) }))
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
        employee = {
            _id: employeeData._id,
            password: employeeUser.password,
            user: createEmployeeUser.toJSON()
        };
        admin = {
            _id: adminData._id,
            password: adminUser.password,
            user: createAdminUser.toJSON()
        };
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            EmployeeModel_1.employeeModel.findByIdAndDelete(employee._id),
            EmployeeModel_1.employeeModel.findByIdAndDelete(admin._id)
        ]);
        yield Promise.all([
            UserModel_1.userModel.findByIdAndDelete(employee.user._id),
            UserModel_1.userModel.findByIdAndDelete(admin.user._id)
        ]);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(createdUsersIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.userModel.findByIdAndDelete(id);
        })));
    }));
    it('should return 400 if do not pass email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            password: employee.user.password
        })
            .expect(400);
    }));
    it('should return 400 if do not pass password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: employee.user.email
        })
            .expect(400);
    }));
    it('should return 400 if do not pass body', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .expect(400);
    }));
    it('should return 404 if user with email does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: 'any@email.com',
            password: 'any_password'
        })
            .expect(404);
    }));
    it('should return 401 if pass incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: employee.user.email,
            password: 'incorrect_password'
        })
            .expect(401);
    }));
    it('should return 404 if email does not belong to an employee', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherUser = user_factory_1.UserFactory.random();
        const createdUser = yield UserModel_1.userModel.create(Object.assign(Object.assign({}, anotherUser), { password: bcrypt_1.default.hashSync(anotherUser.password, 10) }));
        createdUsersIds.push(createdUser._id);
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: anotherUser.email,
            password: anotherUser.password
        })
            .expect(404);
    }));
    it('should return 200 and the body with the employee and token when pass correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: employee.user.email,
            password: employee.password
        })
            .expect(200);
        expect(body.token).toEqual(expect.any(String));
        expect(body.employee.role).toBe(RoleEnum_1.RoleEnum.EMPLOYEE);
        expect(body.employee.employeeId).toEqual(employee._id.toString());
        expect(body.employee.user).toEqual((0, expectedUserBodyFromUserEntity_1.expectedUserBodyFromUserEntity)(employee.user).expectedUser);
    }));
    it('should return 200 and the body with the admin and token when pass correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: admin.user.email,
            password: admin.password
        })
            .expect(200);
        expect(body.token).toEqual(expect.any(String));
        expect(body.employee.role).toBe(RoleEnum_1.RoleEnum.ADMIN);
        expect(body.employee.employeeId).toEqual(admin._id.toString());
        expect(body.employee.user).toEqual((0, expectedUserBodyFromUserEntity_1.expectedUserBodyFromUserEntity)(admin.user).expectedUser);
    }));
    it('should return 200 and its token should have the employee id and role in the payload', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login-employee')
            .send({
            email: employee.user.email,
            password: employee.password
        })
            .expect(200);
        const decoded = jsonwebtoken_1.default.decode(body.token);
        expect(decoded.id).toBe(employee._id.toString());
        expect(decoded.role).toBe(RoleEnum_1.RoleEnum.EMPLOYEE);
    }));
});
