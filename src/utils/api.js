// src/utils/api.js
const API_BASE_URL = 'http://localhost:5000';

export const api = {
  getTracks: async () => {
    const response = await fetch("/tracks")
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    return response.json();
  },
  
  getRecommendations: async (trackName, weather) => {
    const response = await fetch("/result", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackName, weather }),
    });
    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }
    return response.json();
  }
};