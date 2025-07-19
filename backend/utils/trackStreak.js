// utils/trackStreak.js
const Streak = require('../models/Streak');
const dayjs = require('dayjs');

module.exports = async function trackStreak(userId) {
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  let streak = await Streak.findOne({ user: userId });

  if (!streak) {
    streak = new Streak({
      user: userId,
      activeDays: [today],
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today
    });
  } else {
    const lastDate = streak.lastActiveDate;

    if (lastDate === today) return; // Already logged today

    streak.activeDays.push(today);
    streak.lastActiveDate = today;

    if (lastDate === yesterday) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  }

  await streak.save();
};
