import axios from 'axios';

// API untuk ke Server Utama (Backend Express / Supabase API)
export const apiMain = axios.create({
  baseURL: import.meta.env.VITE_API_MAIN_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API khusus untuk komunikasi dengan AI Vision Scanner
export const apiVision = axios.create({
  baseURL: import.meta.env.VITE_API_VISION_URL || 'http://localhost:5002',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});