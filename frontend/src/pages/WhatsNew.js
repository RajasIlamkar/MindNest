import React, { useEffect, useState } from 'react';
import '../styles/WhatsNew.css';

const WhatsNew = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/news`);
        const data = await res.json();
        setArticles(data);
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

