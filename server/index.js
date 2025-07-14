import express from 'express';
import logger from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import chatSocket from './sockets/chat.js';
import './db/client.js';

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

app.use(express.static('client'));
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

chatSocket(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});