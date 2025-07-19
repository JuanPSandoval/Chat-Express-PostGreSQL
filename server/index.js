import express from 'express';
import logger from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import chatSocket from './sockets/chat.js';
import './db/client.js';
import usersRouter from './routes/users.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

// Middleware 
app.use(cookieParser());         
app.use(express.json());
app.use(logger('dev'));

// Servir frontend
app.use(express.static('client'));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

// API
app.use('/api/users', usersRouter);

// WebSocket
chatSocket(io);

// Servidor
server.listen(port, () => {
  console.log(`🔥 Server running on port ${port}`);
});
