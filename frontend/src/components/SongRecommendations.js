import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SongRecommendations.css';

const SongRecommendations = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/songs/recommend', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSongs(res.data.songs || []);
        setMood(res.data.mood || '');
      } catch (err) {
        console.error('Error fetching song recommendations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="song-recommendations">
      <h3>🎵 Spotify Recommendations</h3>
      {loading ? (
        <p className="loading">Analyzing mood and fetching songs...</p>
      ) : (
        <>
        <p className="mood-info">
  Your Mood: <strong>{(mood && mood.charAt(0).toUpperCase() + mood.slice(1)) || 'Unknown'}</strong>
</p>
          <div className="songs-grid">
            {songs.map((song, index) => (
              <a
                key={index}
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="song-card"
              >
                <img src={song.image} alt={song.title} />
                <div className="song-info">
                  <p className="song-title">{song.title}</p>
                  <p className="song-artist">{song.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SongRecommendations;
