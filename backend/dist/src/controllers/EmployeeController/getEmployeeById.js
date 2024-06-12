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
exports.getEmployeeById = void 0;
const EmployeeModel_1 = require("../../models/EmployeeModel");
const NotFoundError_1 = require("../../errors/NotFoundError");
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employeeQuery = EmployeeModel_1.employeeModel.findOne({ _id: id });
    const employee = yield employeeQuery.populate('user');
    if (!employee) {
        throw new NotFoundError_1.NotFoundError('Employee not found', { id });
    }
    return res.json(employee);
});
exports.getEmployeeById = getEmployeeById;
