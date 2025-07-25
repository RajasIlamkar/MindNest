const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const moodSummaryRoute = require('./routes/moodSummary');
const streakRoutes = require('./routes/streakRoutes');
const songRoutes = require('./routes/songRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const axios = require('axios');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood-summary', moodSummaryRoute);
app.use('/api/streak', streakRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/exercises', exerciseRoutes);

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=mental health OR therapy OR anxiety OR depression&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    );
    const filtered = response.data.articles.filter(article => {
      const text = (article.title + ' ' + article.description).toLowerCase();
      return /mental health|anxiety|depression|therapy|psychology/.test(text);
    });

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
