/**
 * Health Check Routes
 * Used for monitoring server status and uptime
 */

import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Returns server health status
 */
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
    });
});

/**
 * GET /api/health/detailed
 * Returns detailed health information
 */
router.get('/detailed', (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        memory: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        },
        cpu: process.cpuUsage(),
    });
});

export default router;
