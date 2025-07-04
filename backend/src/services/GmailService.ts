import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../utils/logger.js';

export interface GmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isOutgoing: boolean;
  source?: 'gmail';
}

export interface GmailThread {
  contactId: number;
  email: string;
  messages: GmailMessage[];
}

export class GmailService {
  private oauth2Client: OAuth2Client;
  private gmail: any;
  private isInitialized: boolean = false;
  
  // Simple cache to avoid repeated API calls
  private messageCache = new Map<string, GmailMessage[]>();
  private cacheTimestamps = new Map<string, number>();
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache

  // Admin email for outgoing detection
  private adminEmail: string;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    // Set admin email for outgoing detection
    this.adminEmail = (process.env.GMAIL_FROM_EMAIL || 'awasey8905@gmail.com').toLowerCase();
    if (!process.env.GMAIL_FROM_EMAIL) {
      logger.warn('GMAIL_FROM_EMAIL not set. Defaulting to awasey8905@gmail.com for outgoing admin detection.');
    }

    // Set refresh token if available
    if (process.env.GMAIL_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });
      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      this.isInitialized = true;
      logger.info('Gmail API initialized successfully');
    } else {
      logger.warn('Gmail refresh token not found. Gmail integration disabled.');
    }
  }

  isConfigured(): boolean {
    return !!(process.env.GMAIL_CLIENT_ID && 
              process.env.GMAIL_CLIENT_SECRET && 
              process.env.GMAIL_REDIRECT_URI);
  }

  isConnected(): boolean {
    return this.isInitialized && !!process.env.GMAIL_REFRESH_TOKEN;
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConnected()) {
      return false;
    }

    try {
      await this.ensureAccessToken();
      
      // Test with a simple profile query
      const response = await this.gmail.users.getProfile({
        userId: 'me'
      });
      
      return !!response.data.emailAddress;
    } catch (error) {
      logger.error('Gmail connection test failed:', error);
      return false;
    }
  }

  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async handleCallback(code: string): Promise<string> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      logger.info('Gmail OAuth tokens received, refresh_token available:', !!tokens.refresh_token);
      
      if (tokens.refresh_token) {
        return tokens.refresh_token;
      } else {
        throw new Error('No refresh token received. Please revoke access and try again.');
      }
    } catch (error) {
      logger.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  private async ensureAccessToken(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
    } catch (error) {
      logger.error('Error refreshing Gmail access token:', error);
      throw new Error('Failed to refresh Gmail access token');
    }
  }

  async searchMessages(query: string): Promise<any[]> {
    if (!this.isConnected()) {
      logger.warn('Gmail not connected, returning empty results');
      return [];
    }

    try {
      await this.ensureAccessToken();
      
      logger.info(`Searching Gmail with query: ${query}`);
      
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50
      });

      const messages = response.data.messages || [];
      logger.info(`Gmail search returned ${messages.length} messages`);
      
      return messages;
    } catch (error) {
      logger.error('Error searching Gmail messages:', error);
      return [];
    }
  }

  async fetchContactReplies(contact: { id: number; email: string; subject: string }): Promise<GmailMessage[]> {
    if (!this.isConnected()) {
      return [];
    }

    // Check cache first (temporarily disabled for testing)
    const cacheKey = `contact_${contact.id}`;
    // Temporarily disable cache to test for new messages
    // const cachedData = this.messageCache.get(cacheKey);
    // const cacheTimestamp = this.cacheTimestamps.get(cacheKey);
    
    // if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp) < this.CACHE_TTL) {
    //   logger.info(`Using cached Gmail messages for contact ${contact.id}`);
    //   return cachedData;
    // }

    try {
      await this.ensureAccessToken();
      
      // Generate email variations but limit them for performance
      const emailVariations = this.generateEmailVariations(contact.email);
      
      // Use a simplified and faster search approach
      const searches: string[] = [];
      
      // Search for both incoming (from contact) and outgoing (to contact) messages
      for (const email of emailVariations.slice(0, 3)) { // Limit to 3 variations max
        searches.push(
          // Incoming: Messages FROM the contact with "Re:"
          `from:${email} subject:"Re:"`,
          // Outgoing: Messages TO the contact with "Re:" 
          `to:${email} subject:"Re:"`,
          // Any recent messages FROM this email
          `from:${email} newer_than:30d`,
          // Any recent messages TO this email
          `to:${email} newer_than:30d`
        );
      }

      let allMessages: GmailMessage[] = [];

      // Process all searches to ensure we find both admin and user messages
      for (let i = 0; i < searches.length; i++) {
        const query = searches[i];
        try {
          logger.info(`Gmail search ${i + 1}/${searches.length}: ${query}`);
          
          // Add timeout to prevent hanging
          const searchPromise = this.gmail.users.messages.list({
            userId: 'me',
            q: query,
            maxResults: 10 // Reduced from 20 to 10 for speed
          });
          
          const response = await Promise.race([
            searchPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Gmail search timeout')), 5000))
          ]);

          const messages = response.data.messages || [];
          logger.info(`Found ${messages.length} messages`);

          if (messages.length > 0) {
            const detailedMessages = await this.getMessageDetails(messages.slice(0, 5)); // Only get details for first 5
            
            // Enhanced filtering - include both incoming and outgoing messages with better Gmail matching
            const relevantMessages = detailedMessages.filter(msg => {
              const fromEmail = msg.from.toLowerCase();
              const toEmail = msg.to.toLowerCase();
              
              // For Gmail addresses, normalize by removing dots for comparison
              const normalizeGmailEmail = (email: string): string => {
                if (email.includes('@gmail.com')) {
                  const [localPart, domain] = email.split('@');
                  if (localPart && domain) {
                    return localPart.replace(/\./g, '') + '@' + domain;
                  }
                }
                return email;
              };
              
              const normalizedFromEmail = normalizeGmailEmail(fromEmail);
              const normalizedToEmail = normalizeGmailEmail(toEmail);
              
              // Check if message is related to any of the email variations
              const isFromMatchingEmail = emailVariations.some(variation => {
                const normalizedVariation = normalizeGmailEmail(variation.toLowerCase());
                return normalizedFromEmail.includes(normalizedVariation) || 
                       normalizedVariation.includes(normalizedFromEmail) ||
                       fromEmail.includes(variation.toLowerCase()) || 
                       variation.toLowerCase().includes(fromEmail);
              });
              
              const isToMatchingEmail = emailVariations.some(variation => {
                const normalizedVariation = normalizeGmailEmail(variation.toLowerCase());
                return normalizedToEmail.includes(normalizedVariation) || 
                       normalizedVariation.includes(normalizedToEmail) ||
                       toEmail.includes(variation.toLowerCase()) || 
                       variation.toLowerCase().includes(toEmail);
              });
              
              const hasReplySubject = msg.subject.toLowerCase().includes('re:');
              
              const isRelevant = (isFromMatchingEmail || isToMatchingEmail) && hasReplySubject;
              
              if (isRelevant) {
                logger.info(`Matched message: from=${fromEmail}, to=${toEmail}, subject=${msg.subject}`);
              }
              
              return isRelevant;
            });
            
            if (relevantMessages.length > 0) {
              allMessages.push(...relevantMessages);
              logger.info(`Found ${relevantMessages.length} relevant replies in this search`);
            }
          }
        } catch (searchError) {
          logger.warn(`Gmail search failed: ${searchError}`);
          continue;
        }
      }

      // Remove duplicates based on message ID
      const uniqueMessages = allMessages.filter((msg, index, self) => 
        index === self.findIndex(m => m.id === msg.id)
      );

      // Cache the results
      this.messageCache.set(cacheKey, uniqueMessages);
      this.cacheTimestamps.set(cacheKey, Date.now());

      return uniqueMessages;
    } catch (error) {
      logger.error(`Error fetching replies for contact ${contact.id}:`, error);
      return [];
    }
  }

  private async getMessageDetails(messages: any[]): Promise<GmailMessage[]> {
    const detailedMessages: GmailMessage[] = [];

    // Process messages in parallel for better performance (but limit concurrency)
    const concurrencyLimit = 3;
    for (let i = 0; i < messages.length; i += concurrencyLimit) {
      const batch = messages.slice(i, i + concurrencyLimit);
      
      const batchPromises = batch.map(async (message) => {
        try {
          // Add timeout to prevent hanging
          const messagePromise = this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });
          
          const response = await Promise.race([
            messagePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Message fetch timeout')), 3000))
          ]);

          const msg = response.data;
          const headers = msg.payload.headers;

          const from = this.getHeader(headers, 'From') || '';
          const to = this.getHeader(headers, 'To') || '';
          const subject = this.getHeader(headers, 'Subject') || '';
          const date = this.getHeader(headers, 'Date') || '';

          // Extract email from "Name <email>" format
          const fromEmail = this.extractEmail(from);
          const toEmail = this.extractEmail(to);

          // Determine if this is outgoing (from admin email)
          const isOutgoing = !!(this.adminEmail && fromEmail.toLowerCase().includes(this.adminEmail));

          const body = this.extractTextFromPayload(msg.payload);
          const cleanBody = this.cleanEmailBody(body);

          return {
            id: msg.id,
            from: fromEmail,
            to: toEmail,
            subject,
            body: cleanBody,
            date: new Date(date).toISOString(),
            isOutgoing,
            source: 'gmail' as const
          };
        } catch (error) {
          logger.error(`Error fetching message details for ${message.id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      detailedMessages.push(...batchResults.filter(msg => msg !== null));
    }

    return detailedMessages;
  }

  private getHeader(headers: any[], name: string): string {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  }

  private extractEmail(emailString: string): string {
    const match = emailString.match(/<([^>]+)>/);
    return match?.[1] || emailString.trim();
  }

  private extractTextFromPayload(payload: any): string {
    let text = '';

    if (payload.body && payload.body.data) {
      text = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          text += Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          text += this.extractTextFromPayload(part);
        }
      }
    }

    return text;
  }

  private cleanEmailBody(body: string): string {
    // Remove quoted content (lines starting with >)
    let lines = body.split('\n');
    
    // Find where quoted content starts
    let quotedStartIndex = lines.findIndex(line => 
      line.trim().startsWith('>') || 
      line.includes('On ') && line.includes('wrote:') ||
      line.includes('From:') && line.includes('Sent:')
    );
    
    if (quotedStartIndex !== -1) {
      lines = lines.slice(0, quotedStartIndex);
    }
    
    // Remove the "Your original message:" section and everything after it
    let originalMessageIndex = lines.findIndex(line => 
      line.trim().toLowerCase().includes('your original message') ||
      line.trim().startsWith('---') ||
      line.trim().toLowerCase().includes('from:') && line.trim().toLowerCase().includes('subject:')
    );
    
    if (originalMessageIndex !== -1) {
      lines = lines.slice(0, originalMessageIndex);
    }
    
    // Remove email signatures (common patterns)
    const signaturePatterns = [
      /^--\s*$/,
      /^Best regards,?\s*$/i,
      /^Regards,?\s*$/i,
      /^Thanks,?\s*$/i,
      /^Sent from my /i,
      /^Abdul Wasey\s*$/i,
      /^Associate Network Engineer\s*$/i,
      /^Email:\s*/i,
      /^Phone:\s*/i,
      /^Website:\s*/i
    ];
    
    let endIndex = lines.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i]?.trim() || '';
      if (signaturePatterns.some(pattern => pattern.test(line)) || line.includes('w453y.me')) {
        endIndex = i;
        break;
      }
    }
    
    lines = lines.slice(0, endIndex);
    
    // Clean up and return - remove empty lines at the end
    while (lines.length > 0 && (lines[lines.length - 1]?.trim() || '') === '') {
      lines.pop();
    }
    
    return lines.join('\n').trim();
  }

  private generateEmailVariations(email: string): string[] {
    const variations = [email]; // Always include the original
    
    // Handle dot variations in Gmail (dots are ignored in Gmail addresses)
    if (email.includes('@gmail.com')) {
      const emailParts = email.split('@');
      if (emailParts.length === 2 && emailParts[0] && emailParts[1]) {
        const localPart = emailParts[0];
        const domain = emailParts[1];
        
        // Add version with dots removed (most common case)
        const withoutDots = localPart.replace(/\./g, '') + '@' + domain;
        if (withoutDots !== email) {
          variations.push(withoutDots);
        }
        
        // For names like "bhashkarconnect", try common word boundary patterns
        if (!localPart.includes('.') && localPart.length > 8) {
          // Common patterns for name combinations
          const commonBreakPoints = [
            // For "bhashkarconnect" -> "bhashkar.connect"
            { pos: 8, pattern: localPart.substring(0, 8) + '.' + localPart.substring(8) },
            // For "bhashkarconnect" -> "bhaskar.connect" (alternative spelling)
            { pos: 7, pattern: localPart.substring(0, 7) + '.' + localPart.substring(7) },
            // Check if it ends with "connect"
            ...(localPart.endsWith('connect') ? [
              { pos: localPart.length - 7, pattern: localPart.substring(0, localPart.length - 7) + '.' + 'connect' }
            ] : [])
          ];
          
          for (const breakPoint of commonBreakPoints) {
            const withDot = breakPoint.pattern + '@' + domain;
            if (!variations.includes(withDot)) {
              variations.push(withDot);
            }
          }
        }
        
        // Add specific known patterns for common name variations
        if (localPart.includes('bhashkar') || localPart.includes('bhaskar')) {
          const knownPatterns = [
            'bhashkar.connect@gmail.com',
            'bhaskar.connect@gmail.com',
            'bhashkarconnect@gmail.com',
            'bhaskarconnect@gmail.com'
          ];
          
          for (const pattern of knownPatterns) {
            if (!variations.includes(pattern)) {
              variations.push(pattern);
            }
          }
        }
        
        // Then add systematic variations but limit them
        if (!localPart.includes('.') && localPart.length > 6) {
          // Try adding dot at likely word boundaries (but limit to 2 more)
          const positions = [6, 7, 8]; // Most likely positions for name.surname
          for (const pos of positions) {
            if (pos < localPart.length - 2) {
              const withDot = localPart.substring(0, pos) + '.' + localPart.substring(pos) + '@' + domain;
              if (!variations.includes(withDot)) {
                variations.push(withDot);
                if (variations.length >= 8) break; // Hard limit
              }
            }
          }
        }
      }
    }
    
    logger.info(`Generated ${variations.length} email variations for ${email}: ${variations.slice(0, 3).join(', ')}...`);
    return variations;
  }

  async getThreadsForContacts(contacts: any[]): Promise<GmailThread[]> {
    const threads: GmailThread[] = [];

    for (const contact of contacts) {
      try {
        const messages = await this.fetchContactReplies(contact);
        
        if (messages.length > 0) {
          threads.push({
            contactId: contact.id,
            email: contact.email,
            messages
          });
        }
      } catch (error) {
        logger.error(`Error fetching thread for contact ${contact.id}:`, error);
        continue;
      }
    }

    return threads;
  }
}
