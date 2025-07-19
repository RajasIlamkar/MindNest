import React from 'react';
import Chatbot from '../components/Chatbot';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your AI Mental Health Support</h1>
          <p className="hero-subtitle">Lay out your thoughts. Ask questions. Anytime.</p>
        </div>
        <div className="blur-circle top-left"></div>
        <div className="blur-circle bottom-right"></div>
      </div>

      <div className="chat-wrapper">
        <Chatbot />
      </div>
    </div>
  );
};

export default Home;
