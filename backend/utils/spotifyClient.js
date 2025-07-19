const axios = require('axios');
const qs = require('qs');

const clientId = '2a3c72cb7ce04cb9915fc43aef5a201d';
const clientSecret = '9b98c8a936ea4188bbb635e54d1e80ca';

// Enhanced mood mapping with multiple query options
const moodToQueries = {
  happy: ['feel good hits', 'hindi happy hits', 'english upbeat pop'],
  sad: ['sad songs', 'melancholy', 'emotional songs'],
  anxious: ['calm music', 'relaxing', 'stress relief'],
  angry: ['angry rock', 'heavy metal', 'intense music'],
  neutral: ['top hits', 'popular songs', 'trending now'],
  excited: ['party anthems', 'dance hits', 'energy boost'],
  calm: ['soothing music', 'peaceful piano', 'ambient']
};

// Popular fallback playlists as last resort
const fallbackPlaylists = {
  neutral: {
    title: 'Today\'s Top Hits',
    url: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF',
    image: 'https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730',
    artist: 'Spotify'
  },
  happy: {
    title: 'Happy Hits!',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
    image: 'https://i.scdn.co/image/ab67706f00000002d72ef75e14ca6f60ea2364c2',
    artist: 'Spotify'
  },
  // Add more fallbacks as needed
};

let tokenCache = { accessToken: '', expiresAt: 0 };

async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.accessToken && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        timeout: 5000
      }
    );

    tokenCache = {
      accessToken: response.data.access_token,
      expiresAt: now + response.data.expires_in * 1000
    };

    return tokenCache.accessToken;
  } catch (err) {
    console.error('Spotify token error:', err.response?.data || err.message);
    throw new Error('Failed to get Spotify access token');
  }
}

async function searchSpotify(query, token) {
  try {
    const res = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=5`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      }
    );

    return res.data.playlists?.items || [];
  } catch (err) {
    console.error(`Spotify search failed for "${query}":`, err.response?.data || err.message);
    return [];
  }
}

async function getSongsForMood(mood) {
  // Normalize mood to ensure it's one of our known types
  const normalizedMood = Object.keys(moodToQueries).includes(mood) ? mood : 'neutral';
  
  try {
    const token = await getAccessToken();
    const queries = moodToQueries[normalizedMood] || moodToQueries.neutral;
    
    let playlists = [];
    
    // Try each query until we get results
    for (const query of queries) {
      const items = await searchSpotify(query, token);
      
      playlists = items
        .filter(p => p?.name && p?.external_urls?.spotify)
        .map(p => ({
          title: p.name,
          url: p.external_urls.spotify,
          image: p.images?.[0]?.url || null,
          artist: p.owner?.display_name || 'Various Artists'
        }));
      
      if (playlists.length > 0) break;
    }

    // If still no results, use fallback
    if (playlists.length === 0) {
      console.warn(`Using fallback playlist for mood: ${normalizedMood}`);
      return [fallbackPlaylists[normalizedMood] || fallbackPlaylists.neutral];
    }

    return playlists.slice(0, 5); // Return max 5 playlists
  } catch (err) {
    console.error('Final Spotify error:', err.message);
    return [fallbackPlaylists.neutral];
  }
}

module.exports = getSongsForMood;