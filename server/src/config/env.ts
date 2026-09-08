import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_PATH: process.env.DATABASE_PATH || path.join(__dirname, '../../data/aegisalert.db'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_PROVIDER: process.env.AI_PROVIDER || 'offline_fallback',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
