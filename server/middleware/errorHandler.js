/**
 * Global Error Handler Middleware
 * Catches and formats all errors uniformly
 */

export const errorHandler = (err, req, res, next) => {
    // Default error values
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const details = process.env.NODE_ENV === 'development' ? err.stack : null;

    console.error(` Error [${status}]: ${message}`, err);

    // Send error response
    res.status(status).json({
        status: 'error',
        statusCode: status,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
    });
};

/**
 * Custom Error Class for consistent error handling
 */
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
