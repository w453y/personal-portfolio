import sqlite3 from 'sqlite3';
import { logger } from '../utils/logger.js';

export interface ReplyRecord {
  id?: number;
  contact_id: number;
  message: string;
  sender: string;
  sender_email: string;
  is_outgoing: boolean;
  created_at?: string;
}

export class ReplyService {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    // Auto-create replies table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        sender TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        is_outgoing INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        logger.error('Error creating replies table:', err);
      } else {
        logger.info('Replies table ensured.');
      }
    });
  }

  async saveReply(reply: ReplyRecord): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO replies (contact_id, message, sender, sender_email, is_outgoing, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;
      const params = [
        reply.contact_id,
        reply.message,
        reply.sender,
        reply.sender_email,
        reply.is_outgoing ? 1 : 0
      ];
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Error saving reply:', err);
          reject(err);
        } else {
          logger.info(`Reply saved with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      });
    });
  }

  async getRepliesForContact(contactId: number): Promise<ReplyRecord[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM replies WHERE contact_id = ? ORDER BY created_at ASC
      `;
      this.db.all(sql, [contactId], (err, rows) => {
        if (err) {
          logger.error('Error fetching replies:', err);
          reject(err);
        } else {
          resolve(rows as ReplyRecord[]);
        }
      });
    });
  }
}
