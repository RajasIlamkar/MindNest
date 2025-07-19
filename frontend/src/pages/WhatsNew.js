// src/pages/WhatsNew.js
import React, { useEffect, useState } from 'react';
import '../styles/WhatsNew.css';

const API_KEY = 'dd189b5365794b5d8fd712345e7329e7'; // Replace with your NewsAPI key

const WhatsNew = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=mental%20health%20OR%20therapy%20OR%20anxiety%20OR%20depression&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
    );
    const data = await res.json();

    // Optional: Filter results to make sure mental health terms appear in title or description
    const filtered = (data.articles || []).filter(article => {
      const text = (article.title + ' ' + article.description).toLowerCase();
      return /mental health|anxiety|depression|therapy|psychology/.test(text);
    });

    setArticles(filtered);
  } catch (err) {
    console.error('Error fetching articles:', err);
  } finally {
    setLoading(false);
  }
};


    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h2>📰 What’s New in Mental Health</h2>
      {loading ? <p>Loading articles...</p> : (
        <div className="articles-grid">
          {articles.map((article, index) => (
            <div key={index} className="article-card">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <img src={article.urlToImage || '/placeholder.jpg'} alt="Article" />
                <h3>{article.title}</h3>
                <p>{article.description?.slice(0, 100)}...</p>
                <p className="source">{article.source.name}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatsNew;
