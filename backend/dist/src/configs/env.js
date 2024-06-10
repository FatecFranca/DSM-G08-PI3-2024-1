"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
//TODO: Create variable to create admin user with default password and email. OPTIONAL
const environment = process.env.NODE_ENV || 'dev';
if (environment === 'dev') {
    dotenv_1.default.config({
        path: '.env',
    });
}
else if (environment === 'test') {
    dotenv_1.default.config({
        path: '.env.test',
    });
}
else {
    throw Error('Environment not supported');
}
const ENVZodType = environment === 'dev' ? zod_1.z.literal('dev') : zod_1.z.literal('test');
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('8080'),
    DATABASE_URL: zod_1.z.string(),
    ENV: ENVZodType,
    JWT_SECRET: zod_1.z.string(),
    ADMIN_EMAIL: zod_1.z.string().email(),
    ADMIN_PASSWORD: (0, zod_1.string)().min(8)
});
exports.env = exports.envSchema.parse(process.env);
