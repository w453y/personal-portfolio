import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { contactRoutes } from './routes/contact.js';
import { healthRoutes } from './routes/health.js';
import { adminRoutes } from './routes/admin.js';
import { initDatabase } from './database/init.js';

const app = express();

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - Allow all origins in development
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (config.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (config.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Authenticated-User'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { 
  stream: { 
    write: (message) => logger.info(message.trim()) 
  },
  skip: (req) => req.url === '/api/health' // Skip health check logs
}));

// Authentication bypass middleware for NGINX-protected routes
app.use((req, res, next) => {
  // Check if NGINX authentication is disabled (development mode)
  if (process.env.DISABLE_BACKEND_AUTH === 'true' || config.NODE_ENV === 'development') {
    // In production, NGINX handles authentication and sets X-Authenticated-User header
    // In development, we bypass authentication entirely
    (req as any).user = { 
      username: req.headers['x-authenticated-user'] || 'admin',
      authenticated: true 
    };
    logger.debug('Backend authentication bypassed - NGINX handles auth');
  }
  next();
});

// Request timeout middleware
app.use((req, res, next) => {
  // Set timeout to 60 seconds
  const timeoutMs = 60000;
  
  const timeout = setTimeout(() => {
    logger.error('Request timeout:', req.url);
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    }
  }, timeoutMs);
  
  // Clear timeout when response finishes
  res.on('finish', () => {
    clearTimeout(timeout);
  });
  
  res.on('close', () => {
    clearTimeout(timeout);
  });
  
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    authentication: process.env.DISABLE_BACKEND_AUTH === 'true' ? 'nginx-only' : 'backend-enabled'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    logger.info('Database initialized successfully');

    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info(`Server running on ${config.HOST}:${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`CORS Origins: ${config.CORS_ORIGINS.join(', ')}`);
      logger.info(`Authentication: ${process.env.DISABLE_BACKEND_AUTH === 'true' ? 'NGINX-only (backend auth disabled)' : 'Backend-enabled'}`);
      logger.info(`Request Timeout: 60 seconds`);
    });

    // Set server timeout to 65 seconds (slightly higher than request timeout)
    server.timeout = 65000;
    server.keepAliveTimeout = 61000;
    server.headersTimeout = 62000;

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;