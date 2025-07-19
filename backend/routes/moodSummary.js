const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { chatHistory } = req.body;

  try {
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              'You are a compassionate mental health AI. Summarize the user’s emotional state based on this chat history and suggest coping methods. Talk as if you are talking to the user',
          },
          {
            role: 'user',
            content: chatHistory,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = groqRes.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate mood summary' });
  }
});

module.exports = router;
