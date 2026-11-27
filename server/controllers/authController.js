/**
 * Authentication Controller
 * Handles all authentication logic
 */

import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware.js';
import { AppError } from '../middleware/errorHandler.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

// In-memory user storage (replace with database later)
const users = new Map();

/**
 * POST /api/auth/signup
 * Register a new user
 */
export const signup = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (!username || !email || !password) {
            return next(new AppError('Missing required fields', 400));
        }

        if (!validateEmail(email)) {
            return next(new AppError('Invalid email format', 400));
        }

        if (!validatePassword(password)) {
            return next(
                new AppError(
                    'Password must be at least 6 characters',
                    400
                )
            );
        }

        if (password !== confirmPassword) {
            return next(new AppError('Passwords do not match', 400));
        }

        // Check if user already exists
        if (users.has(email)) {
            return next(new AppError('Email already registered', 409));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user (replace with database later)
        users.set(email, {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        // Generate token
        const token = generateToken({ email, username });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                username,
                email,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return next(new AppError('Email and password required', 400));
        }

        if (!validateEmail(email)) {
            return next(new AppError('Invalid email format', 400));
        }

        // Find user
        const user = users.get(email);
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Generate token
        const token = generateToken({ email: user.email, username: user.username });

        res.json({
            status: 'success',
            message: 'Login successful',
            ok: true,
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
export const verify = async (req, res, next) => {
    try {
        const user = req.user; // Set by verifyAuth middleware

        res.json({
            status: 'success',
            message: 'Token verified',
            ok: true,
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/logout
 * Logout user (token cleanup on client-side)
 */
export const logout = async (req, res, next) => {
    try {
        res.json({
            status: 'success',
            message: 'Logout successful',
            ok: true,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user; // Set by verifyAuth middleware

        res.json({
            status: 'success',
            user,
        });
    } catch (err) {
        next(err);
    }
};
