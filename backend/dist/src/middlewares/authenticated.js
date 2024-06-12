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
exports.authenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../configs/env");
const authenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: 'Token is required'
        });
    }
    const [bearer, tokenValue] = token.split(' ');
    if (bearer !== 'Bearer') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    if (!tokenValue) {
        return res.status(401).json({
            message: 'Token is required'
        });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(tokenValue, env_1.env.JWT_SECRET);
        req.payload = payload;
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    next();
});
exports.authenticated = authenticated;
