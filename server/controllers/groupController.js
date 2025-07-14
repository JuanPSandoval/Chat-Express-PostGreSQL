import bcrypt from 'bcryptjs';
import { createGroup, findGroupById } from '../models/groupModel.js';
import { saveMessage, getMessagesByGroup } from '../models/messageModel.js';

export async function handleCreateGroup(socket, { id, name, password }) {
  try {
    const hash = await bcrypt.hash(password, 10);
    await createGroup(id, name, hash);
    socket.emit('group created', { id, name });
  } catch (e) {
    socket.emit('group error', 'No se pudo crear el grupo (puede que el ID ya exista)');
  }
}

export async function handleJoinGroup(socket, { id, password }) {
  try {
    const group = await findGroupById(id);
    if (!group) {
      socket.emit('group error', 'Grupo no encontrado');
      return;
    }
    const valid = await bcrypt.compare(password, group.password);
    if (!valid) {
      socket.emit('group error', 'Contraseña incorrecta');
      return;
    }
    socket.join(id);
    socket.data.group_id = id;
    socket.emit('group joined', id);
  } catch (e) {
    socket.emit('group error', 'Error al unirse al grupo');
  }
}

export async function handleChatMessage(socket, msg, groupIdFromClient) {
  try {
    const username = socket.handshake.auth.username ?? 'anonymous';
    const result = await saveMessage(msg, username, groupIdFromClient);
    socket.to(groupIdFromClient).emit('chat message', msg, result.lastInsertRowid.toString(), username);
  } catch (e) {
    console.error(e);
  }
}

export async function handleGetGroupMessages(socket, group_id) {
  try {
    if (!group_id) return;
    const messages = await getMessagesByGroup(group_id);
    messages.forEach(row => {
      socket.emit('chat message', row.content, row.id.toString(), row.user);
    });
  } catch (e) {
    console.error(e);
  }
}