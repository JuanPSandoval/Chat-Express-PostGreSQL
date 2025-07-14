import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.DB_LINK,
  authToken: process.env.DB_TOKEN
});

// Crear tablas si no existen
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT,
    group_id TEXT
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT,
    password TEXT
  )
`);