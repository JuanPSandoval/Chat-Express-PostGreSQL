import bcrypt from 'bcryptjs';
import { createGroup, findGroupById } from '../models/groupModel.js';
import { saveMessage, getMessagesByGroup } from '../models/messageModel.js';
import cookie from 'cookie';
import { verificarToken } from '../utils/jwt.js';

// controllers/groupController.js


export async function handleCreateGroup(socket, { id, name, password }) {
  try {
    // 1. Extraer cookies del handshake
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) throw new Error('No hay cookies');

    // 2. Parsear cookies
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;
    if (!token) throw new Error('Token no encontrado');

    // 3. Verificar token
    verificarToken(token); // Si es inválido, lanza error

    // 4. Crear grupo si todo está bien
    const hash = await bcrypt.hash(password, 10);
    await createGroup(id, name, hash);
    socket.emit('group created', { id, name });

  } catch (e) {
    socket.emit('group error', 'Acceso denegado o error: ' + e.message);
  }
}

export async function handleJoinGroup(socket, { id, password }) {
  try {
    // 1. Extraer cookies del handshake
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) throw new Error('No hay cookies');

    // 2. Parsear cookies
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;
    if (!token) throw new Error('Token no encontrado');

    // 3. Verificar token
    verificarToken(token); // Si es inválido, lanza error

    const group = await findGroupById(id);
    if (!group) throw new Error('Grupo no encontrado');

    const valid = await bcrypt.compare(password, group.password);
    if (!valid) throw new Error('Contraseña incorrecta');

    socket.join(id);
    socket.data.group_id = id;
    socket.emit('group joined', id);
  } catch (e) {
    socket.emit('group error', e.message || 'Error al unirse al grupo');
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