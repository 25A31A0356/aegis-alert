import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';
import { seedDatabase } from './seed';

// Ensure data directory exists
const dbDir = path.dirname(ENV.DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export class Database {
  private static instance: Database;
  private db: sqlite3.Database;

  private constructor() {
    this.db = new sqlite3.Database(ENV.DATABASE_PATH, (err) => {
      if (err) {
        console.error('[DATABASE] Failed to connect to SQLite database:', err.message);
      } else {
        console.log(`[DATABASE] Connected to SQLite database at ${ENV.DATABASE_PATH}`);
      }
    });

    this.init();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private init(): void {
    const candidatePaths = [
      path.join(__dirname, 'schema.sql'),
      path.join(__dirname, '../../../src/database/schema.sql'),
      path.join(__dirname, '../../src/database/schema.sql'),
      path.join(process.cwd(), 'src/database/schema.sql'),
      path.join(process.cwd(), 'server/src/database/schema.sql'),
    ];

    let schemaSql: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        schemaSql = fs.readFileSync(p, 'utf8');
        console.log(`[DATABASE] Found schema file at ${p}`);
        break;
      }
    }

    if (schemaSql) {
      this.db.exec(schemaSql, (err) => {
        if (err) {
          console.error('[DATABASE] Error executing schema initialization:', err.message);
        } else {
          console.log('[DATABASE] Schema initialized successfully.');
          seedDatabase(this);
        }
      });
    } else {
      console.warn('[DATABASE] Warning: schema.sql not found in candidate paths.');
    }
  }

  public all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
      });
    });
  }

  public get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row as T | undefined);
      });
    });
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

export const db = Database.getInstance();
