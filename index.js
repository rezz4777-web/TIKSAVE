// index.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Melayani file statis (HTML, CSS, JS) dari folder yang sama
app.use(express.static(__dirname));

// --- API ENDPOINT ---
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL TikTok diperlukan.' });
  }

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ success: false, error: 'Server error: API Key missing.' });
  }

  const options = {
    method: 'GET',
    url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
    params: { url: url, hd: '1' },
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-Rapidapi-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const videoData = response.data;

    if (videoData.code === 0 && videoData.data && videoData.data.play) {
      const { play, hdplay, title, author, cover, duration, play_count, size, hd_size } = videoData.data;
      res.status(200).json({ 
        success: true, 
        downloadUrl: play, 
        downloadUrlHd: hdplay, 
        title, 
        author, 
        cover, 
        duration, 
        play_count, 
        size, 
        hd_size 
      });
    } else {
      res.status(404).json({ success: false, error: 'Tidak dapat menemukan link video.' });
    }
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan server.' });
  }
});

// --- FALLBACK ROUTE (UNTUK MENANGANI ROUTING FRONTEND) ---
app.all('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// EKSPOR UNTUK VERCEL
module.exports = app;
