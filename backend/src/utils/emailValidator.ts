import dns from 'dns';
import { promisify } from 'util';
import validator from 'email-validator';

const resolveMx = promisify(dns.resolveMx);

export interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
}

export class EmailValidator {
  private static cache = new Map<string, { result: EmailValidationResult; timestamp: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  /**
   * Validates email format and checks if domain has MX records - STRICT VALIDATION
   */
  static async validateEmail(email: string): Promise<EmailValidationResult> {
    try {
      // Basic format validation first
      if (!email || typeof email !== 'string') {
        return {
          isValid: false,
          reason: 'Email is required'
        };
      }

      // Trim whitespace and convert to lowercase for consistency
      email = email.trim().toLowerCase();

      if (!email) {
        return {
          isValid: false,
          reason: 'Email is required'
        };
      }

      // Check cache first
      const cached = this.cache.get(email);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
        return cached.result;
      }

      // Basic format validation
      if (!validator.validate(email)) {
        const result = {
          isValid: false,
          reason: 'Invalid email format'
        };
        this.cache.set(email, { result, timestamp: Date.now() });
        return result;
      }

      // Extract domain
      const domain = email.split('@')[1];
      if (!domain) {
        const result = {
          isValid: false,
          reason: 'Invalid email format'
        };
        this.cache.set(email, { result, timestamp: Date.now() });
        return result;
      }

      // For development/testing, allow localhost domains
      if (domain === 'localhost' || domain.endsWith('.local')) {
        const result = {
          isValid: true,
          reason: undefined
        };
        this.cache.set(email, { result, timestamp: Date.now() });
        return result;
      }

      // Check if domain has MX records - STRICT CHECK FOR ALL DOMAINS
      try {
        const mxRecords = await Promise.race([
          resolveMx(domain),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DNS timeout')), 10000) // 10 second timeout
          )
        ]) as any[];

        if (!mxRecords || mxRecords.length === 0) {
          const result = {
            isValid: false,
            reason: 'Email domain does not exist or cannot receive emails'
          };
          this.cache.set(email, { result, timestamp: Date.now() });
          return result;
        }

        // Valid email with working domain
        const result = {
          isValid: true,
          reason: undefined
        };
        this.cache.set(email, { result, timestamp: Date.now() });
        return result;

      } catch (dnsError) {
        console.warn(`DNS lookup failed for ${domain}:`, dnsError);
        
        // STRICT: If DNS lookup fails, consider email invalid
        const result = {
          isValid: false,
          reason: 'Cannot verify email domain - domain may not exist'
        };
        this.cache.set(email, { result, timestamp: Date.now() });
        return result;
      }
    } catch (error) {
      console.error('Email validation error:', error);
      
      // STRICT: If validation fails, consider email invalid
      const result = {
        isValid: false,
        reason: 'Email validation failed - please check your email address'
      };
      
      return result;
    }
  }

  /**
   * Quick format-only validation (for real-time frontend validation)
   */
  static validateFormat(email: string): boolean {
    return validator.validate(email);
  }

  /**
   * Clear old cache entries
   */
  static clearExpiredCache(): void {
    const now = Date.now();
    for (const [email, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.cache.delete(email);
      }
    }
  }
}

// Clean up cache every 10 minutes
setInterval(() => {
  EmailValidator.clearExpiredCache();
}, 10 * 60 * 1000);