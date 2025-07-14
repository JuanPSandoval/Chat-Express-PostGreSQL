import { db } from '../db/client.js';

export async function createGroup(id, name, passwordHash) {
  return await db.execute({
    sql: 'INSERT INTO groups (id, name, password) VALUES (:id, :name, :password)',
    args: { id, name, password: passwordHash }
  });
}

export async function findGroupById(id) {
  const result = await db.execute({
    sql: 'SELECT * FROM groups WHERE id = :id',
    args: { id }
  });
  return result.rows[0];
}