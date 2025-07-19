import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StreakCalendar.css';

const StreakCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalizedData = res.data.calendar.map(item => {
          const date = new Date(item.date);
          const localDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          return {
            ...item,
            date: localDate.toISOString().split('T')[0]
          };
        });

        setCalendarData(normalizedData);
        setCurrentStreak(res.data.currentStreak);
        setLongestStreak(res.data.longestStreak);
      } catch (err) {
        console.error('Error fetching streak:', err.message);
      }
    };

    fetchStreak();
  }, [token]);

  const dayMap = (calendarData || []).reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});

  const getMonthCalendar = (date = currentDate) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

    const calendar = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startDay + 1;
      if (i < startDay || dayNum > daysInMonth) {
        calendar.push(null);
      } else {
        const dateObj = new Date(year, month, dayNum);
        const dateStr = dateObj.toISOString().split('T')[0];
        calendar.push({
          date: dateStr,
          dayNumber: dayNum,
          dateObj: dateObj
        });
      }
    }

    const weeks = [];
    for (let i = 0; i < calendar.length; i += 7) {
      weeks.push(calendar.slice(i, i + 7));
    }
    return weeks;
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (dateObj) => {
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  };

  const getActivityLevel = (count) => {
    if (count >= 5) return 3;
    if (count >= 3) return 2;
    if (count >= 1) return 1;
    return 0;
  };

  return (
    <div className="streak-calendar-dark">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h3>{getMonthName()}</h3>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      <div className="streak-stats">
        <div className="stat-item">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">🔥 {currentStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Longest Streak</span>
          <span className="stat-value">🏆 {longestStreak}</span>
        </div>
      </div>

      <div className="weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {getMonthCalendar().map((week, i) =>
          week.map((dayObj, j) => {
            if (!dayObj) {
              return <div key={`empty-${i}-${j}`} className="calendar-cell empty"></div>;
            }

            const { date, dayNumber, dateObj } = dayObj;
            const count = dayMap[date] || 0;
            const activityLevel = getActivityLevel(count);
            const today = isToday(dateObj);

            let className = "calendar-cell";
            if (activityLevel === 3) className += " active-high";
            else if (activityLevel === 2) className += " active-med";
            else if (activityLevel === 1) className += " active-low";
            if (today) className += " today";

            const displayDate = dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div
                key={date}
                className={className}
                title={`${displayDate} — ${count} message(s)`}
              >
                <div className="day-number">{dayNumber}</div>
                {today && <div className="today-indicator"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StreakCalendar;
