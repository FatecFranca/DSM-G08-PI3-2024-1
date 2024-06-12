"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRoutes_1 = __importDefault(require("../routes/UserRoutes"));
const AuthRoutes_1 = __importDefault(require("../routes/AuthRoutes"));
const EmployeeRoutes_1 = __importDefault(require("../routes/EmployeeRoutes"));
const ChatRoutes_1 = __importDefault(require("../routes/ChatRoutes"));
const routes = (0, express_1.Router)();
routes.use('/users', UserRoutes_1.default);
routes.use('/auth', AuthRoutes_1.default);
routes.use('/employees', EmployeeRoutes_1.default);
routes.use('/chats', ChatRoutes_1.default);
exports.default = routes;
