import {
  handleChatMessage,
  handleCreateGroup,
  handleJoinGroup,
  handleGetGroupMessages
} from '../controllers/groupController.js';

export default function(io) {
  io.on('connection', (socket) => {
    console.log('Usuario Conectado', socket.id);

    socket.on('disconnect', () => {
      console.log('Usuario Desconectado', socket.id);
    });

    socket.on('chat message', (msg, groupIdFromClient) => handleChatMessage(socket, msg, groupIdFromClient));
    socket.on('create group', (data) => handleCreateGroup(socket, data));
    socket.on('join group', (data) => handleJoinGroup(socket, data));
    socket.on('get group messages', (groupId) => handleGetGroupMessages(socket, groupId));
  });
}