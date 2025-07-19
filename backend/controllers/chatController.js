const axios = require('axios');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const trackStreak = require('../utils/trackStreak'); // ✅ Import streak tracker

const guestSessions = {}; // Temporary in-memory session tracking

const sendMessage = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        let userId = null;

        // Guest logic
        if (!req.headers.authorization) {
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID required for guests' });
            }

            if (!guestSessions[sessionId]) {
                guestSessions[sessionId] = { count: 0 };
            }

            if (guestSessions[sessionId].count >= 5) {
                return res.status(403).json({ message: 'Guest message limit reached. Please sign up.' });
            }

            guestSessions[sessionId].count += 1;
        } else {
            // Authenticated user
            const token = req.headers.authorization.split(' ')[1];
            const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
            userId = decoded.id;

            // ✅ Track streak for user
            await trackStreak(userId);
        }

        // Call Groq API
        const groqRes = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are a friendly and supportive mental health AI named MindNest. Talk to the user like a professional therapist." },
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const botReply = groqRes.data.choices[0].message.content;

        // Save to DB
        const chat = new Chat({
            user: userId || null,
            sessionId: userId ? null : sessionId,
            messages: [
                { role: 'user', content: message },
                { role: 'assistant', content: botReply }
            ]
        });

        await chat.save();

        res.status(200).json({ reply: botReply });

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).json({ message: 'Failed to get AI response' });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
};

module.exports = {
    sendMessage,
    getChatHistory
};
