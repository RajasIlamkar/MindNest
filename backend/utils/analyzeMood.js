const axios = require('axios');

// Strict mood options
const VALID_MOODS = [
  'happy', 'sad', 'anxious', 'angry', 
  'neutral', 'excited', 'calm', 
  'fearful', 'frustrated'
];

const systemPrompt = `
You are a mood detection system. Analyze the user's messages and respond with ONE word from this exact list:
${VALID_MOODS.join(', ')}

Rules:
1. Respond with only one lowercase word
2. Never add punctuation or explanations
3. If uncertain, choose "neutral"
4. Focus on emotional tone and word choices

Example conversations:
User: I'm so excited for the concert tonight!
Assistant: excited

User: Everything is going wrong today
Assistant: angry

User: What's the weather today?
Assistant: neutral
`;

async function analyzeMood(messages) {
  if (!process.env.GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY');
    return 'neutral';
  }

  try {
    // Filter and prepare only user messages
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join('\n---\n');

    if (!userMessages.trim()) {
      return 'neutral';
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these messages:\n${userMessages}` }
        ],
        temperature: 0.1,
        max_tokens: 10,
        stop: ['\n', '.', ',']
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    // Extract and clean the response
    let mood = response.data.choices[0]?.message?.content?.trim().toLowerCase();
    mood = mood.replace(/[^a-z]/g, ''); // Remove any non-letters

    // Validate the response
    if (!VALID_MOODS.includes(mood)) {
      console.warn(`Invalid mood response: ${mood}`);
      return 'neutral';
    }

    return mood;
  } catch (error) {
    console.error('Mood analysis failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return 'neutral';
  }
}

module.exports = analyzeMood;