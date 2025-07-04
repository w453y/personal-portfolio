import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists
    const dataDir = path.dirname(config.DATABASE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      logger.info(`Created data directory: ${dataDir}`);
    }

    const db = new sqlite3.Database(config.DATABASE_PATH, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        reject(err);
        return;
      }

      logger.info(`Database connected: ${config.DATABASE_PATH}`);

      // Create contacts table
      const createContactsTable = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          subject TEXT NOT NULL,
          phone TEXT,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          timestamp TEXT,
          is_read BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(createContactsTable, (err) => {
        if (err) {
          logger.error('Error creating contacts table:', err);
          reject(err);
          return;
        }

        logger.info('Contacts table created/verified');

        // Create indexes for better performance
        const createIndexes = [
          'CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)',
          'CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)',
          'CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read)',
        ];

        let indexesCreated = 0;
        const totalIndexes = createIndexes.length;

        createIndexes.forEach((indexSql) => {
          db.run(indexSql, (err) => {
            if (err) {
              logger.error('Error creating index:', err);
              reject(err);
              return;
            }

            indexesCreated++;
            if (indexesCreated === totalIndexes) {
              logger.info('Database indexes created/verified');
              
              // Close the initialization connection
              db.close((err) => {
                if (err) {
                  logger.error('Error closing database:', err);
                  reject(err);
                } else {
                  logger.info('Database initialization completed');
                  resolve();
                }
              });
            }
          });
        });
      });
    });
  });
}