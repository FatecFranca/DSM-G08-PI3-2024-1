import { Schema, model } from 'mongoose'

//TODO: Add column chat status. Like 'open', 'resolved'
const ChatSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendant: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  messages: [{
    user: {
      type: Schema.Types.ObjectId,
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
})

export const chatModel = model('Chat', ChatSchema)