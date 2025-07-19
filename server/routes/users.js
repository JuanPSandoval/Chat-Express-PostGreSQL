import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/usersController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);

export default router;