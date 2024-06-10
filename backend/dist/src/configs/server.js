"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const zod_1 = require("zod");
const AppError_1 = require("../errors/AppError");
const BodyValidationError_1 = require("../errors/BodyValidationError");
const swagger_output_json_1 = __importDefault(require("../swagger_output.json"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve);
app.get('/api-docs', swagger_ui_express_1.default.setup(swagger_output_json_1.default, {
    swaggerOptions: {
        supportedSubmitMethods: []
    }
}));
app.use((error, req, res, next) => {
    let resultError;
    if (error instanceof AppError_1.AppError) {
        resultError = error;
    }
    else if (error instanceof zod_1.ZodError) {
        resultError = BodyValidationError_1.BodyValidationError.fromZodError(error);
    }
    else {
        console.log(error);
        resultError = AppError_1.AppError.internalServerError('Internal server error');
    }
    return res.status(resultError.statusCode).json(resultError);
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*'
    }
});
exports.io = io;
exports.default = server;
