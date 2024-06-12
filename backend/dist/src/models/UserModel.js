"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.zodUserSchema = exports.zodAddressSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const cpf_1 = require("@fnando/cpf");
exports.zodAddressSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongoose_1.Types.ObjectId).optional(),
    cep: zod_1.z.string(),
    street: zod_1.z.string(),
    num: zod_1.z.string(),
    city: zod_1.z.string(),
    uf: zod_1.z.string(),
});
exports.zodUserSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongoose_1.Types.ObjectId).optional(),
    name: zod_1.z.string(),
    lastName: zod_1.z.string(),
    gender: zod_1.z.string(),
    password: zod_1.z.string(),
    email: zod_1.z.string().email(),
    cpf: zod_1.z.string().refine((cpf) => {
        return (0, cpf_1.isValid)(cpf);
    }, { message: 'Invalid CPF' }),
    data_nascimento: zod_1.z.coerce.date(),
    address: exports.zodAddressSchema,
    healthInfo: zod_1.z.object({
        cardiorespiratoryDisease: zod_1.z.string().optional(),
        surgery: zod_1.z.string().optional(),
        allergy: zod_1.z.string().optional(),
        preExistingCondition: zod_1.z.string().optional(),
        medicineInUse: zod_1.z.string().optional(),
    }).optional()
});
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    data_nascimento: {
        type: Date,
        required: true
    },
    address: {
        type: {
            cep: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            num: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            uf: {
                type: String,
                required: true
            },
        },
        required: true
    },
    healthInfo: {
        type: {
            cardiorespiratoryDisease: {
                type: String,
                required: false
            },
            surgery: {
                type: String,
                required: false
            },
            allergy: {
                type: String,
                required: false
            },
            preExistingCondition: {
                type: String,
                required: false
            },
            medicineInUse: {
                type: String,
                required: false
            },
        },
        required: false
    }
});
exports.userModel = (0, mongoose_1.model)('User', UserSchema);
