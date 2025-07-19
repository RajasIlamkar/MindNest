import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ExerciseRecommendations.css';

const ExerciseRecommendations = () => {
  const [exercises, setExercises] = useState([]);
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/exercises/recommend`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(data.exercises); // [{ name: '...', benefits: '...' }, ...]
        setMood(data.mood);
      } catch (err) {
        console.error('Failed to fetch exercises', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="exercise-recommendation-container">
      <h2>💪 Mood-Based Exercises</h2>
      {loading ? (
        <p className="loading-text">Analyzing mood and loading recommendations...</p>
      ) : (
        <>
          <p className="detected-mood"> Mood: <strong>{mood.charAt(0).toUpperCase() + mood.slice(1)}</strong></p>
          <ul className="exercise-list">
            {exercises.map((exercise, idx) => (
              <li key={idx} className="exercise-item">
                <p className="exercise-name"><strong>{exercise.name}</strong></p>
                <p className="exercise-benefits">{exercise.benefits}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ExerciseRecommendations;
