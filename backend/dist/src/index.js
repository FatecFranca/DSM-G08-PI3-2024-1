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
const mongoose_1 = __importDefault(require("mongoose"));
require("./configs/websockets");
const env_1 = require("./configs/env");
const server_1 = __importDefault(require("./configs/server"));
const EmployeeModel_1 = require("./models/EmployeeModel");
const RoleEnum_1 = require("./types/RoleEnum");
const UserModel_1 = require("./models/UserModel");
mongoose_1.default.connect(env_1.env.DATABASE_URL)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const hasAdmin = yield EmployeeModel_1.employeeModel.findOne({
        role: RoleEnum_1.RoleEnum.ADMIN
    });
    if (!hasAdmin) {
        const adminUser = yield UserModel_1.userModel.create({
            cpf: 'undefined',
            data_nascimento: new Date(),
            email: env_1.env.ADMIN_EMAIL,
            password: env_1.env.ADMIN_PASSWORD,
            gender: 'undefined',
            lastName: 'ADMIN',
            name: 'Admin',
            address: {
                cep: 'undefined',
                street: 'undefined',
                num: 0,
                city: 'undefined',
                uf: 'undefined'
            }
        });
        yield EmployeeModel_1.employeeModel.create({
            role: RoleEnum_1.RoleEnum.ADMIN,
            user: adminUser._id
        });
    }
    server_1.default.listen(env_1.env.PORT, () => console.log(`Server runing at: http://localhost:${env_1.env.PORT}`));
}))
    .catch(err => {
    console.log(err);
});
