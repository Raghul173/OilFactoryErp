import express from 'express';
import {
  login,
  googleAuth,
  registerNewCredentials,
  updateProfile,
  getMe,
  getAccountsPool
} from '../controllers/authController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/google', googleAuth);
router.get('/accounts-pool', getAccountsPool);
router.post('/register-credentials', authenticateToken, requireRole(['Administrator']), registerNewCredentials);
router.put('/profile', authenticateToken, updateProfile);
router.get('/me', authenticateToken, getMe);

export default router;
