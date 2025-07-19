import { db } from '../db/client.js';

export async function createUser(username, passwordHash) {
  return await db.execute({
    sql: 'INSERT INTO users (username, password) VALUES (:username, :password)',
    args: { username, password: passwordHash }
  });
}

export async function findUserByUsername(username) {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE username = :username',
    args: { username }
  });
  return result.rows[0];
}