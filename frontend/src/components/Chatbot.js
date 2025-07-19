import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const messagesEndRef = useRef(null);

  const sessionId = localStorage.getItem('sessionId') || (() => {
    const newId = uuidv4();
    localStorage.setItem('sessionId', newId);
    return newId;
  })();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      if (!token || !sessionId) {
        setTimeout(() => setShowPlaceholder(true), 200);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chat/history?sessionId=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const orderedMessages = res.data
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .flatMap(chat => chat.messages);

        if (orderedMessages.length === 0) {
          setTimeout(() => setShowPlaceholder(true), 500);
        } else {
          setChat(orderedMessages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err.message);
        setTimeout(() => setShowPlaceholder(true), 500);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowPlaceholder(false);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          message: input,
          sessionId,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token')
              ? `Bearer ${localStorage.getItem('token')}`
              : '',
          },
        }
      );

      const botMessage = { role: 'assistant', content: res.data.reply };
      setChat(prev => [...prev, botMessage]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: ' + (err.response?.data?.message || 'Something went wrong'),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        <div className="chat-messages-container">
          {chat.length === 0 && showPlaceholder ? (
            <div className="empty-chat-placeholder">
              <p>What's on your mind?</p>
            </div>
          ) : (
            chat.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-content">
                  <div className="message-bubble">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="chat-message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? (
                <div className="button-loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                '→'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
