import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const DOMAIN = process.env.DOMAIN || 'localhost';

export const config = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // CORS configuration
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8080',
    `https://${DOMAIN}`,
    `https://www.${DOMAIN}`,
    `https://portfolio.${DOMAIN}`
  ],

  // Database configuration
  DATABASE_PATH: process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'portfolio.db'),

  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Email settings
  FROM_EMAIL: process.env.FROM_EMAIL || `noreply@${DOMAIN}`,
  TO_EMAIL: process.env.TO_EMAIL || `admin@${DOMAIN}`,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || `admin@${DOMAIN}`,
  MESSAGE_ID_DOMAIN: process.env.MESSAGE_ID_DOMAIN || DOMAIN,

  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),

  // Rate limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  CONTACT_RATE_LIMIT_WINDOW: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW || '3600000', 10), // 1 hour
  CONTACT_RATE_LIMIT_MAX: parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5', 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log'),

  // Application settings
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH || '5000', 10),
  MIN_MESSAGE_LENGTH: parseInt(process.env.MIN_MESSAGE_LENGTH || '10', 10),
};

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'TO_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('Email functionality may not work properly.');
}