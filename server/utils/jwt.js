import jwt from 'jsonwebtoken';

const SECRET = process.env.JW_TOKEN_SECRET;

export function generarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

export function verificarToken(token) {
  return jwt.verify(token, SECRET);
}
