// routes/streakRoutes.js
const express = require('express');
const router = express.Router();
const Streak = require('../models/Streak');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const streak = await Streak.findOne({ user: req.user._id });

    if (!streak) {
      return res.json({
        calendar: [],
        currentStreak: 0,
        longestStreak: 0
      });
    }

    // Convert activeDays array to calendar array with count = 1
    const calendar = streak.activeDays.map(date => ({
      date,
      count: 1
    }));

    res.json({
      calendar,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    });
  } catch (err) {
    console.error('Streak fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

module.exports = router;
