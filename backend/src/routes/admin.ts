import express, { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/ContactService.js';
import { GmailService, GmailMessage } from '../services/GmailService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const contactService = new ContactService();
const gmailService = new GmailService();

// NO AUTHENTICATION MIDDLEWARE - NGINX handles all authentication
// All endpoints are protected by NGINX session cookies

// Simple endpoint to test authentication (handled by NGINX)
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: req.headers['x-authenticated-user'] || 'admin',
    timestamp: new Date().toISOString()
  });
});

// Health check for admin endpoints
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    user: req.headers['x-authenticated-user'] || 'admin',
    timestamp: new Date().toISOString()
  });
});

// Get conversation threads (combining local messages with Gmail replies)
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    // Get recent contacts only for better performance
    const contacts = await contactService.getContacts(20, 0); // Reduced from 100 to 20
    
    // Check if Gmail is configured
    const gmailConfigured = gmailService.isConfigured();
    let gmailThreads: any[] = [];
    
    if (gmailConfigured) {
      try {
        // Test Gmail connection first
        const isConnected = await gmailService.testConnection();
        if (isConnected) {
          gmailThreads = await gmailService.getThreadsForContacts(contacts);
        } else {
          logger.warn('Gmail API not connected, showing local messages only');
        }
      } catch (error) {
        logger.error('Gmail API error:', error);
        // Continue without Gmail data
      }
    }

    // Combine local contacts with Gmail threads
    const conversations = contacts.map(contact => {
      // Find Gmail threads for this specific contact
      const relatedGmailThread = gmailThreads.find(thread => 
        thread.contactId === contact.id
      );

      const conversation = {
        contactId: contact.id,
        email: contact.email,
        name: contact.name,
        subject: contact.subject,
        isRead: contact.is_read,
        lastActivity: contact.created_at,
        messages: [
          // Original contact form message
          {
            id: `contact-${contact.id}`,
            from: `${contact.name} <${contact.email}>`,
            to: 'admin',
            subject: contact.subject,
            body: contact.message,
            date: new Date(contact.created_at).toISOString(), // Normalize to ISO format
            isOutgoing: false,
            source: 'contact-form'
          }
        ]
      };

      // Add Gmail replies to the conversation
      if (relatedGmailThread && relatedGmailThread.messages.length > 0) {
        conversation.messages.push(...relatedGmailThread.messages);
        // Update last activity if Gmail message is newer
        const latestGmailDate = Math.max(...relatedGmailThread.messages.map((m: any) => new Date(m.date).getTime()));
        const contactDate = new Date(contact.created_at).getTime();
        if (latestGmailDate > contactDate) {
          conversation.lastActivity = new Date(latestGmailDate).toISOString();
          // If there are new Gmail messages, conversation should be marked as unread
          if (conversation.isRead) {
            conversation.isRead = false; // Mark as unread if there are new Gmail replies
          }
        }
      }

      // Sort messages by date
      conversation.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return conversation;
    });

    // Sort conversations by last activity
    conversations.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

    res.json({
      success: true,
      conversations,
      gmailConfigured,
      totalConversations: conversations.length
    });

  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// Get Gmail configuration status
router.get('/gmail/status', async (req: Request, res: Response) => {
  try {
    const isConfigured = gmailService.isConfigured();
    let isConnected = false;

    if (isConfigured) {
      isConnected = await gmailService.testConnection();
    }

    res.json({
      success: true,
      configured: isConfigured,
      connected: isConnected,
      authUrl: isConfigured ? null : gmailService.getAuthUrl()
    });
  } catch (error) {
    logger.error('Error checking Gmail status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check Gmail status'
    });
  }
});

// Gmail OAuth callback endpoint
router.post('/gmail/authorize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    
    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
      return;
    }

    const refreshToken = await gmailService.handleCallback(code);
    
    // In a production app, you'd want to save these tokens securely
    logger.info('Gmail tokens obtained:', {
      refresh_token: refreshToken ? 'present' : 'missing'
    });

    res.json({
      success: true,
      message: 'Gmail authorization successful',
      tokens: {
        refresh_token: refreshToken || null
      }
    });
  } catch (error) {
    logger.error('Gmail authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Gmail authorization failed'
    });
  }
});

// Gmail OAuth callback GET endpoint (for redirect handling)
router.get('/gmail/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      res.status(400).send(`
        <html>
          <body>
            <h2>Gmail Authorization Failed</h2>
            <p>Error: ${error}</p>
            <p><a href="http://localhost:8080/mailbox">Return to Mailbox</a></p>
          </body>
        </html>
      `);
      return;
    }

    if (!code) {
      res.status(400).send(`
        <html>
          <body>
            <h2>Gmail Authorization Failed</h2>
            <p>No authorization code received</p>
            <p><a href="http://localhost:8080/mailbox">Return to Mailbox</a></p>
          </body>
        </html>
      `);
      return;
    }

    const refreshToken = await gmailService.handleCallback(code as string);
    
    // In a production app, you'd want to save these tokens securely
    logger.info('Gmail tokens obtained via callback:', {
      refresh_token: refreshToken ? 'present' : 'missing'
    });

    // Show success page with instructions
    res.send(`
      <html>
        <head>
          <title>Gmail Authorization Successful</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .success { color: #28a745; }
            .code { background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; word-break: break-all; border: 1px solid #ddd; }
            .warning { color: #856404; background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
            .copy-btn { margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
            .step { margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
          </style>
        </head>
        <body>
          <h2 class="success">✅ Gmail Authorization Successful!</h2>
          <p>Your Gmail API connection has been established.</p>
          
          <div class="warning">
            <strong>Important:</strong> To complete the setup, you need to add the refresh token to your environment variables.
          </div>
          
          <div class="step">
            <h3>Step 1: Copy this refresh token</h3>
            <div class="code" id="refreshToken">${refreshToken || 'REFRESH_TOKEN_NOT_AVAILABLE'}</div>
            <button class="copy-btn" onclick="copyToClipboard('refreshToken')">Copy Token</button>
          </div>
          
          <div class="step">
            <h3>Step 2: Add to your backend/.env.development file</h3>
            <div class="code">GMAIL_REFRESH_TOKEN=${refreshToken || 'YOUR_TOKEN_HERE'}</div>
          </div>
          
          <div class="step">
            <h3>Step 3: Restart your backend server</h3>
            <p>Stop the backend (Ctrl+C) and run <code>npm run dev</code> again in the backend directory.</p>
          </div>
          
          <div class="step">
            <h3>Step 4: Test the integration</h3>
            <p><a href="http://localhost:8080/mailbox" target="_blank">Open Mailbox</a> and check if Gmail status shows "Connected"</p>
          </div>
          
          <script>
            function copyToClipboard(elementId) {
              const element = document.getElementById(elementId);
              const text = element.textContent;
              navigator.clipboard.writeText(text).then(function() {
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    logger.error('Gmail callback error:', error);
    res.status(500).send(`
      <html>
        <body>
          <h2>Gmail Authorization Failed</h2>
          <p>An error occurred during authorization: ${error}</p>
          <p><a href="http://localhost:8080/mailbox">Return to Mailbox</a></p>
        </body>
      </html>
    `);
  }
});

// Debug endpoint to test Gmail search
router.get('/gmail/debug', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!gmailService.isConfigured()) {
      res.json({
        success: false,
        message: 'Gmail not configured'
      });
      return;
    }

    // Test connection
    const isConnected = await gmailService.testConnection();
    if (!isConnected) {
      res.json({
        success: false,
        message: 'Gmail not connected'
      });
      return;
    }

    // Check if detailed debug is requested
    const detailed = req.query.detailed === 'true';
    const queryParam = req.query.query as string;

    if (queryParam) {
      // Single search query with message details
      const messages = await gmailService.searchMessages(queryParam);
      const details = detailed ? await (gmailService as any).getMessageDetails(messages.slice(0, 3)) : null;
      
      res.json({
        success: true,
        query: queryParam,
        count: messages.length,
        messageIds: messages.map((m: any) => m.id),
        details: details?.map((d: any) => ({
          id: d.id,
          from: d.from,
          to: d.to,
          subject: d.subject,
          date: d.date,
          bodyPreview: d.body.substring(0, 200) + (d.body.length > 200 ? '...' : '')
        })) || null
      });
      return;
    }

    // Try different search queries to debug
    const searches = [
      'from:(-me)',  // All emails not from me
      'from:aw.221mt001@nitk.edu.in',  // Specific sender
      'subject:"Re:"',  // Reply subjects
      'in:inbox'  // All inbox messages
    ];

    const results: Record<string, any> = {};

    for (const query of searches) {
      try {
        const gmail = (gmailService as any).gmail; // Access private gmail instance
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 5,
        });
        
        results[query] = {
          count: response.data.messages?.length || 0,
          messages: response.data.messages?.map((m: any) => m.id) || []
        };
      } catch (error: any) {
        results[query] = { error: error?.message || 'Unknown error' };
      }
    }

    res.json({
      success: true,
      searches: results,
      debug: 'Gmail search debugging results'
    });

  } catch (error: any) {
    logger.error('Gmail debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Gmail debug failed',
      error: error?.message || 'Unknown error'
    });
  }
});

// Custom debug endpoint to check specific email
router.get('/gmail/debug-email/:email', async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.params.email;
    
    if (!gmailService.isConfigured() || !gmailService.isConnected()) {
      res.json({
        success: false,
        message: 'Gmail not configured or connected'
      });
      return;
    }

    // Search for emails from this specific address
    const searches = [
      `from:${email}`,
      `from:${email} newer_than:7d`,
      `from:${email} subject:"Re:"`,
      `${email}` // Broader search including to/from
    ];

    const results: Record<string, any> = {};

    for (const query of searches) {
      try {
        const messages = await gmailService.searchMessages(query);
        results[query] = {
          count: messages.length,
          messageIds: messages.map((m: any) => m.id)
        };
      } catch (error) {
        results[query] = { error: error };
      }
    }

    res.json({
      success: true,
      email: email,
      searches: results,
      debug: `Gmail search results for ${email}`
    });

  } catch (error) {
    logger.error('Gmail email debug failed:', error);
    res.json({
      success: false,
      message: 'Gmail email debug failed',
      error: error
    });
  }
});

// Get individual conversation details with Gmail thread
router.get('/conversations/:contactId', async (req: Request, res: Response) => {
  try {
    const contactIdParam = req.params.contactId;
    if (!contactIdParam) {
      res.status(400).json({
        success: false,
        message: 'Contact ID is required'
      });
      return;
    }
    
    const contactId = parseInt(contactIdParam);
    if (isNaN(contactId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
      return;
    }

    // Get the contact message
    const contact = await contactService.getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    // Build the conversation object
    const conversation = {
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email,
      subject: contact.subject,
      isRead: contact.is_read,
      lastActivity: contact.created_at,
      messages: [{
        id: `contact_${contact.id}`,
        content: contact.message,
        sender: contact.name,
        senderEmail: contact.email,
        date: contact.created_at,
        isOutgoing: false,
        type: 'contact_form'
      }]
    };

    // Add local admin replies
    try {
      const localReplies = await contactService.replyService.getRepliesForContact(contact.id);
      if (localReplies && localReplies.length > 0) {
        conversation.messages.push(...localReplies.map(reply => ({
          id: `reply_${reply.id}`,
          content: reply.message,
          sender: reply.sender,
          senderEmail: reply.sender_email,
          date: reply.created_at || new Date().toISOString(),
          isOutgoing: reply.is_outgoing,
          type: 'local_reply'
        })));
      }
    } catch (localReplyError) {
      logger.warn(`Local reply fetch failed for contact ${contact.id}:`, localReplyError);
    }

    // Try to get Gmail thread for this contact
    try {
      const gmailMessages = await gmailService.fetchContactReplies({
        id: contact.id,
        email: contact.email,
        subject: contact.subject
      });
      
      if (gmailMessages && gmailMessages.length > 0) {
        logger.info(`Found ${gmailMessages.length} Gmail messages for contact ${contact.id}`);
        
        // Add Gmail messages to the conversation
        conversation.messages.push(...gmailMessages.map(msg => ({
          id: msg.id,
          content: msg.body,
          sender: msg.isOutgoing ? 'Admin' : contact.name,
          senderEmail: msg.isOutgoing ? msg.from : msg.to,
          date: msg.date,
          isOutgoing: msg.isOutgoing,
          type: 'gmail'
        })));
        
        // Update last activity with the latest Gmail message date
        const latestGmailDate = Math.max(...gmailMessages.map((msg: GmailMessage) => new Date(msg.date).getTime()));
        if (latestGmailDate > new Date(conversation.lastActivity).getTime()) {
          conversation.lastActivity = new Date(latestGmailDate).toISOString();
        }
      }
    } catch (gmailError) {
      logger.warn(`Gmail fetch failed for contact ${contact.id}:`, gmailError);
      // Continue without Gmail data
    }

    // Sort messages by date
    conversation.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json({
      success: true,
      conversation
    });

  } catch (error) {
    logger.error('Error fetching conversation details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation details'
    });
  }
});

export { router as adminRoutes };