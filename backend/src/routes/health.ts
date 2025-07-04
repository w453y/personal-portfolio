import express, { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ContactService } from '../services/ContactService.js';

const router = express.Router();

// NO AUTHENTICATION MIDDLEWARE - NGINX handles all authentication
// Health endpoints are public

// Public health check endpoint - NO sensitive data exposed
router.get('/', async (req: Request, res: Response) => {
  try {
    const contactService = new ContactService();
    
    // Test database connection
    await contactService.getContactCount();
    
    const healthData = {
      status: 'healthy',
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      authentication: process.env.DISABLE_BACKEND_AUTH === 'true' ? 'nginx-only' : 'backend-enabled',
      timeout: '60 seconds',
      // NEVER expose sensitive environment variables
    };

    res.json(healthData);
    
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      success: false,
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});

// Detailed health check - PROTECTED by NGINX (no backend auth needed)
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const contactService = new ContactService();
    
    const dbTest = await contactService.getContactCount();
    
    const healthData = {
      status: 'healthy',
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      authentication: process.env.DISABLE_BACKEND_AUTH === 'true' ? 'nginx-only' : 'backend-enabled',
      user: req.headers['x-authenticated-user'] || 'unknown',
      timeout: '60 seconds',
      services: {
        database: {
          status: 'connected',
          totalMessages: dbTest,
        },
        email: {
          status: 'configured',
          host: process.env.SMTP_HOST || 'not configured',
          // NEVER expose SMTP_USER or SMTP_PASS
        },
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid,
      },
    };

    res.json(healthData);
    
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as healthRoutes };