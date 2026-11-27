/**
 * Authentication Routes
 * Handles user login, signup, verification, and logout
 */

import express from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import {
    login,
    signup,
    verify,
    logout,
    getCurrentUser,
} from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 * Body: { username, email, password }
 */
router.post('/signup', authLimiter, signup);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 * Body: { email, password }
 */
router.post('/login', authLimiter, login);

/**
 * POST /api/auth/verify
 * Verify JWT token
 * Headers: { Authorization: "Bearer <token>" }
 */
router.post('/verify', verifyAuth, verify);

/**
 * POST /api/auth/logout
 * Logout user (client-side token cleanup)
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 * Get current authenticated user info
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/me', verifyAuth, getCurrentUser);

export default router;
