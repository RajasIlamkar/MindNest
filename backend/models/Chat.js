const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    messages: [
        {
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String, required: true }
        }
    ],
    sessionId: { type: String }, // for guest tracking
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
