import dotenv from 'dotenv';
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL;
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;