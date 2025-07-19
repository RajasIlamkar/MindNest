// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const analyzeMood = require('../utils/analyzeMood');
const getSongsForMood = require('../utils/spotifyClient');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommend', protect, async (req, res) => {
  try {
    // Get chat history with debugging info
    const chat = await Chat.findOne({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    if (!chat || !chat.messages || chat.messages.length === 0) {
      console.log('No chat messages found for user:', req.user._id);
      return res.json({
        mood: 'neutral',
        songs: [{
          title: 'Popular Hits',
          url: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'
        }],
        debug: { message: 'No chat history found' }
      });
    }

    // Prepare messages for analysis
    const recentMessages = chat.messages
      .slice(-15)
      .map(m => ({ role: m.role, content: m.content }));

    console.log('Messages being analyzed:', recentMessages);

    // Analyze mood with timeout
    let mood;
    try {
      mood = await analyzeMood(recentMessages);
      console.log('Successfully detected mood:', mood);
    } catch (err) {
      console.error('Mood analysis error:', err);
      mood = 'neutral';
    }

    // Get recommendations
    let songs;
    try {
      songs = await getSongsForMood(mood);
    } catch (err) {
      console.error('Spotify error:', err);
      songs = [{
        title: `${mood} Music`,
        url: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'
      }];
    }

    res.json({
      mood,
      songs,
      debug: {
        messageCount: recentMessages.length,
        userMessages: recentMessages.filter(m => m.role === 'user').length
      }
    });

  } catch (err) {
    console.error('Recommendation system error:', err);
    res.status(500).json({
      error: 'Recommendation service unavailable',
      defaultSongs: [{
        title: 'Popular Hits',
        url: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'
      }]
    });
  }
});

module.exports = router;