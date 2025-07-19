// models/Streak.js
const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  activeDays: {
    type: [String], // Array of date strings: ['2025-06-17', '2025-06-18', ...]
    default: []
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: String, // 'YYYY-MM-DD'
    default: null
  }
});

module.exports = mongoose.model('Streak', streakSchema);
