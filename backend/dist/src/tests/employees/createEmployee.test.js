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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../configs/server"));
const EmployeeModel_1 = require("../../models/EmployeeModel");
const UserModel_1 = require("../../models/UserModel");
const RoleEnum_1 = require("../../types/RoleEnum");
const user_factory_1 = require("../utils/user-factory");
describe('POST /employees', () => {
    let admin;
    let user;
    let employee;
    let createdUsersIds = [];
    let createdEmployeesIds = [];
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
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
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
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(createdEmployeesIds.map((id) => __awaiter(void 0, void 0, void 0, function* () { return UserModel_1.userModel.findByIdAndDelete(id); })));
        yield Promise.all(createdUsersIds.map((id) => __awaiter(void 0, void 0, void 0, function* () { return UserModel_1.userModel.findByIdAndDelete(id); })));
    }));
    it('should return 200 is pass valid data and is authenticated and authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: user.user._id,
            role: RoleEnum_1.RoleEnum.EMPLOYEE
        })
            .expect(201);
        const savedEmployee = yield EmployeeModel_1.employeeModel.findById(body._id);
        expect(savedEmployee).toBeTruthy();
        expect(savedEmployee === null || savedEmployee === void 0 ? void 0 : savedEmployee.user).toEqual(user.user._id);
    }));
    it('should return 403 if pass a valid data and is authenticated as employee', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', employee.bearerToken)
            .send({
            userId: user.user._id,
            role: RoleEnum_1.RoleEnum.EMPLOYEE
        })
            .expect(403);
    }));
    it('should return 403 if pass a valid data and is authenticated as user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', user.bearerToken)
            .send({
            userId: user.user._id,
            role: RoleEnum_1.RoleEnum.EMPLOYEE
        })
            .expect(403);
    }));
    it('should return 400 if pass a invalid userId', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: 'invalid',
            role: RoleEnum_1.RoleEnum.EMPLOYEE
        })
            .expect(400);
    }));
    it('should return 404 if pass a inexistent userId', () => __awaiter(void 0, void 0, void 0, function* () {
        const anotherId = new mongoose_1.Types.ObjectId();
        const { body } = yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: anotherId.toString(),
            role: RoleEnum_1.RoleEnum.EMPLOYEE
        })
            .expect(404);
        expect(body.queryParams).toEqual({ userId: anotherId.toString() });
    }));
    it('should return 400 if pass a invalid role', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: user.user._id,
            role: 'invalid'
        })
            .expect(400);
    }));
    it('should return 403 if pass a valid data and is authenticated and authorized as admin and already exists one', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: admin.user._id,
            role: RoleEnum_1.RoleEnum.ADMIN
        })
            .expect(403);
    }));
    it('should return 400 if pass user role', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/employees')
            .set('Authorization', admin.bearerToken)
            .send({
            userId: user.user._id,
            role: RoleEnum_1.RoleEnum.USER
        })
            .expect(400);
    }));
});
