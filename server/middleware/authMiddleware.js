/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 */

import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verify JWT token from Authorization header
 * Expected format: "Bearer <token>"
 */
export const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new AppError('Invalid or expired token', 401));
    }
};

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {string} expiresIn - Token expiration time (default: 7d)
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Optional auth middleware
 * Verifies token if provided, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Token invalid, but we don't fail - just continue without user
        }
    }

    next();
};
