import sqlite3 from 'sqlite3';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { ReplyService } from './ReplyService.js';

export interface ContactData {
  name: string;
  email: string;
  message: string;
  subject: string;
  phone?: string | null;
  ip_address: string;
  user_agent: string;
  referrer: string;
  timestamp: string;
}

export interface ContactRecord extends ContactData {
  id: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export class ContactService {
  private db: sqlite3.Database;
  replyService: ReplyService;

  constructor() {
    this.db = new sqlite3.Database(config.DATABASE_PATH);
    this.replyService = new ReplyService(config.DATABASE_PATH);
  }

  async saveContact(data: ContactData): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO contacts (
          name, email, message, subject, phone, 
          ip_address, user_agent, referrer, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        data.name,
        data.email,
        data.message,
        data.subject,
        data.phone,
        data.ip_address,
        data.user_agent,
        data.referrer,
        data.timestamp,
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Error saving contact:', err);
          reject(err);
        } else {
          logger.info(`Contact saved with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      });
    });
  }

  async getContacts(limit: number = 20, offset: number = 0): Promise<ContactRecord[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM contacts 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;

      this.db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
          logger.error('Error fetching contacts:', err);
          reject(err);
        } else {
          resolve(rows as ContactRecord[]);
        }
      });
    });
  }

  async getContactById(id: number): Promise<ContactRecord | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM contacts WHERE id = ?';

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          logger.error('Error fetching contact by ID:', err);
          reject(err);
        } else {
          resolve(row as ContactRecord || null);
        }
      });
    });
  }

  async getContactCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM contacts';

      this.db.get(sql, [], (err, row: any) => {
        if (err) {
          logger.error('Error getting contact count:', err);
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  async markAsRead(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE contacts SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

      this.db.run(sql, [id], function(err) {
        if (err) {
          logger.error('Error marking contact as read:', err);
          reject(err);
        } else {
          logger.info(`Contact ${id} marked as read`);
          resolve();
        }
      });
    });
  }

  async getUnreadCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM contacts WHERE is_read = 0';

      this.db.get(sql, [], (err, row: any) => {
        if (err) {
          logger.error('Error getting unread count:', err);
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  async deleteContact(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM contacts WHERE id = ?';
      this.db.run(sql, [id], (err) => {
        if (err) {
          logger.error('Error deleting contact:', err);
          reject(err);
        } else {
          logger.info(`Contact ${id} deleted successfully`);
          resolve();
        }
      });
    });
  }

  async getContactsByEmail(email: string): Promise<ContactRecord[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, name, email, message, subject, phone, 
               ip_address, user_agent, referrer, timestamp,
               is_read, created_at, updated_at
        FROM contacts 
        WHERE email = ? 
        ORDER BY created_at DESC
      `;

      this.db.all(sql, [email], (err, rows: any[]) => {
        if (err) {
          logger.error('Error fetching contacts by email:', err);
          reject(err);
        } else {
          resolve(rows as ContactRecord[]);
        }
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        logger.error('Error closing database:', err);
      } else {
        logger.info('Database connection closed');
      }
    });
  }
}