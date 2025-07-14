import { db } from '../db/client.js';

export async function saveMessage(content, user, group_id) {
  return await db.execute({
    sql: 'INSERT INTO messages (content, user, group_id) VALUES (:content, :user, :group_id)',
    args: { content, user, group_id }
  });
}

export async function getMessagesByGroup(group_id) {
  const results = await db.execute({
    sql: 'SELECT * FROM messages WHERE group_id = :group_id',
    args: { group_id }
  });
  return results.rows;
}