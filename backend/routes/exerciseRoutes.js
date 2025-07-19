const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const analyzeMood = require('../utils/analyzeMood');
const getExercisesForMood = require('../utils/exerciseRecommender');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommend', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();
 
    if (!chat || !chat.messages || chat.messages.length === 0) {
      return res.status(400).json({ error: 'No chat history found.' });
    }

    const recentMessages = chat.messages.slice(-10);
    const mood = await analyzeMood(recentMessages);
    const exercises = await getExercisesForMood(mood);

    res.json({ mood, exercises });
  } catch (err) {
    console.error('Exercise recommendation error:', err.message);
    res.status(500).json({ error: 'Failed to generate exercise recommendations' });
  }
});

module.exports = router;
