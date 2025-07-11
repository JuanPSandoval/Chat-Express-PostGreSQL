import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import bcrypt from 'bcryptjs'


dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})
app.use(express.static('client'))

const db = createClient({
  url: process.env.DB_LINK,
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user ,
    group_id TEXT
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT,
    password TEXT
  )
`);


io.on('connection', async (socket) => {
  console.log('Usuario Conectado', socket.id)

  socket.on('disconnect', () => {
    console.log('Usuario Desconectado', socket.id)
  })

  socket.on('chat message', async (msg, groupIdFromClient) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'
    console.log({ username, groupIdFromClient})
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user, group_id) VALUES (:msg, :username, :group_id)',
        args: { msg, username, group_id: groupIdFromClient }
      });
      socket.to(groupIdFromClient).emit('chat message', msg, result.lastInsertRowid.toString(), username)
    } catch (e) {
      console.error(e)
      return
    }

    
  })
  socket.on('create group', async ({ id, name, password }) => {
    try {
      // Hashea la contraseña antes de guardar
      const hash = await bcrypt.hash(password, 10);
      await db.execute({
        sql: 'INSERT INTO groups (id, name, password) VALUES (:id, :name, :password)',
        args: { id, name, password: hash }
      });
      socket.emit('group created', { id, name });
    } catch (e) {
      socket.emit('group error', 'No se pudo crear el grupo (puede que el ID ya exista)');
    }
  });

  socket.on('join group', async ({ id, password }) => {
  try {
    const result = await db.execute({
      sql: 'SELECT password FROM groups WHERE id = :id',
      args: { id }
    });
    if (result.rows.length === 0) {
      socket.emit('group error', 'Grupo no encontrado');
      return;
    }
    const hash = result.rows[0].password;
    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      socket.emit('group error', 'Contraseña incorrecta');
      return;
    }
    socket.join(id);
    socket.data.group_id = id; // Store the group_id in socket.data
    socket.emit('group joined', id);
  } catch (e) {
    socket.emit('group error', 'Error al unirse al grupo');
  }
});

  socket.on('get group messages', async (group_id) => { 
  try {
    if (!group_id) return; // No está en ningún grupo
    const results = await db.execute({
      sql: 'SELECT * FROM messages WHERE group_id = :group_id',
      args: { group_id}
    });

    results.rows.forEach(row => {
      socket.emit('chat message', row.content, row.id.toString(), row.user);
    });
  } catch (e) {
    console.error(e);
  }
})
}

)

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})