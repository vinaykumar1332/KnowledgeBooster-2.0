/**
 * Rate Limiter Middleware
 * Prevents abuse by limiting requests per IP
 */

import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

export const limiter = rateLimit({
    windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many requests. Please try again later.',
            retryAfter: req.rateLimit.resetTime,
        });
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/api/health';
    },
});

/**
 * Stricter rate limiter for auth endpoints
 * More restrictive for login/signup to prevent brute force
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Lenient rate limiter for GET requests (search, browse)
 */
export const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Higher limit for search
    standardHeaders: true,
    legacyHeaders: false,
});
