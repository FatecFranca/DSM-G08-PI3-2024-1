"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
//TODO: Add column chat status. Like 'open', 'resolved'
const ChatSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    messages: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
                type: String,
                required: true
            },
            sentWhen: {
                type: Date,
                default: Date.now
            }
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.chatModel = (0, mongoose_1.model)('Chat', ChatSchema);
