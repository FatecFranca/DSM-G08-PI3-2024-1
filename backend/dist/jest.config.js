"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./src/configs/server");
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
exports.default = config;
