import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ContactService } from '../services/ContactService.js';
import { EmailService } from '../services/EmailService.js';
import { EmailValidator } from '../utils/emailValidator.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

const router = express.Router();
const contactService = new ContactService();
const emailService = new EmailService();

// NO AUTHENTICATION MIDDLEWARE - NGINX handles all authentication
// All endpoints are public at backend level, NGINX protects them

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name contains invalid characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('message')
    .trim()
    .isLength({ min: config.MIN_MESSAGE_LENGTH, max: config.MAX_MESSAGE_LENGTH })
    .withMessage(`Message must be between ${config.MIN_MESSAGE_LENGTH} and ${config.MAX_MESSAGE_LENGTH} characters`),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters'),
  
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .custom((value) => {
      if (value && value.length > 0) {
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
          throw new Error('Please provide a valid phone number');
        }
      }
      return true;
    }),
];

// Email validation endpoint - PUBLIC (no auth required)
router.post('/validate-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        isValid: false,
        reason: 'Email is required'
      });
    }

    logger.info(`Email validation request for: ${email}`);
    
    const validation = await EmailValidator.validateEmail(email);
    
    logger.info(`Email validation result for ${email}: ${validation.isValid ? 'valid' : 'invalid'} - ${validation.reason || 'no reason'}`);
    
    return res.json({
      success: true,
      isValid: validation.isValid,
      reason: validation.reason
    });
  } catch (error) {
    logger.error('Email validation error:', error);
    return res.status(500).json({
      success: false,
      isValid: false,
      reason: 'Validation service temporarily unavailable'
    });
  }
});

// Submit contact form - PUBLIC (no auth required)
router.post('/', contactValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, message, subject, phone, timestamp, userAgent, referrer } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    const contactData = {
      name,
      email,
      message,
      subject: subject || 'New Contact Form Message',
      phone: phone || null,
      ip_address: clientIP,
      user_agent: userAgent || req.get('User-Agent') || 'unknown',
      referrer: referrer || req.get('Referer') || 'direct',
      timestamp: timestamp || new Date().toISOString(),
    };

    const contactId = await contactService.saveContact(contactData);

    try {
      await emailService.sendContactNotification({
        id: contactId,
        ...contactData,
      });
      logger.info(`Contact form submitted and email sent for ID: ${contactId}`);
    } catch (emailError) {
      logger.error('Failed to send email notification:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      id: contactId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
});

// Get all messages - PROTECTED by NGINX (no backend auth needed)
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const messages = await contactService.getContacts(limit, offset);
    const total = await contactService.getContactCount();

    return res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    logger.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
});

// Get single message by ID - PROTECTED by NGINX (no backend auth needed)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required',
      });
    }

    const messageId = parseInt(id);
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    const message = await contactService.getContactById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    return res.json({
      success: true,
      data: message,
    });

  } catch (error) {
    logger.error('Error fetching contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
    });
  }
});

// Mark message as read - PROTECTED by NGINX (no backend auth needed)
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required',
      });
    }

    const messageId = parseInt(id);
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    await contactService.markAsRead(messageId);

    return res.json({
      success: true,
      message: 'Message marked as read',
    });

  } catch (error) {
    logger.error('Error marking message as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update message',
    });
  }
});

// Reply to message - PROTECTED by NGINX (no backend auth needed)
router.post('/:id/reply', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;
    const adminUser = req.headers['x-authenticated-user'] || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || config.ADMIN_EMAIL || 'admin@yourdomain.com'; // Configurable admin email
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required',
      });
    }

    if (!replyMessage || replyMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
    }

    const messageId = parseInt(id);
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    const originalMessage = await contactService.getContactById(messageId);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found',
      });
    }

    logger.info(`Sending reply for message ID: ${messageId} to ${originalMessage.email}`);

    // Send reply email
    await emailService.sendReplyEmail(originalMessage, replyMessage);
    
    // Store reply in local DB
    await contactService.replyService.saveReply({
      contact_id: messageId,
      message: replyMessage,
      sender: adminUser as string,
      sender_email: adminEmail,
      is_outgoing: true
    });
    
    // Mark as read
    await contactService.markAsRead(messageId);

    logger.info(`Reply sent and stored for message ID: ${messageId}`);

    return res.json({
      success: true,
      message: 'Reply sent successfully',
    });

  } catch (error) {
    logger.error('Error sending reply:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to send reply: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

// Delete message - PROTECTED by NGINX (no backend auth needed)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required',
      });
    }

    const messageId = parseInt(id);
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    // Check if message exists
    const message = await contactService.getContactById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Delete the message
    await contactService.deleteContact(messageId);
    
    logger.info(`Message ${messageId} deleted successfully`);

    return res.json({
      success: true,
      message: 'Message deleted successfully',
    });

  } catch (error) {
    logger.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export { router as contactRoutes };