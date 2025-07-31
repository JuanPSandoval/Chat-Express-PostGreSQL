// controllers/usersController.js
import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/userModel.js';
import { generarToken } from '../utils/jwt.js';

export async function registerUser(req, res) {
  const { username, password } = req.body;
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }
  const hash = await bcrypt.hash(password, 10);
  await createUser(username, hash);
  res.status(201).json({ message: 'Usuario registrado' });
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = generarToken({ username });

  res.cookie('username', username, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false 
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  });
  
  res.json({ message: 'Login exitoso' });
}

export async function getCurrentUser(req, res) {
  const username = req.cookies?.username;
  console.log("Cookies recibidas:", req.cookies); 
  if (!username) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  res.json({ username });
}
