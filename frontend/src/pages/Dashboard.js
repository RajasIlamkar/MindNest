import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StreakCalendar from '../components/StreakCalendar';
import SongRecommendations from '../components/SongRecommendations';
import ExerciseRecommendations from '../components/ExerciseRecommendations'; // ✅ New import
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const sessionId = localStorage.getItem('sessionId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const chatRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chat/history?sessionId=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const messages = chatRes.data
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .flatMap(chat => chat.messages)
          .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
          .join('\n');

        const moodRes = await axios.post(
          'http://localhost:5000/api/mood-summary',
          { chatHistory: messages },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSummary(moodRes.data.summary);
      } catch (err) {
        console.error('Failed to fetch mood summary:', err.message);
        setSummary('Could not generate summary. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [sessionId, token]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Daily Insights</h2>

      <div className="dashboard-content">
        <div className="streak-calendar-box">
          <StreakCalendar />
        </div>

        {loading ? (
          <p className="dashboard-loading">Analyzing mood from your chats...</p>
        ) : (
          <div className="mood-summary-box">
            <h3>Mood Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>

      {/* 🔥 New: Dual Recommendation Section */}
      <div className="recommendations-row">
        <SongRecommendations />
        <ExerciseRecommendations />
      </div>
    </div>
  );
};

export default Dashboard;
