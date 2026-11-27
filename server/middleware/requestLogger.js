/**
 * Request Logger Middleware
 * Logs all incoming requests with method, path, status, and response time
 */

export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const method = req.method;
    const path = req.path;
    const ip = req.ip || req.connection.remoteAddress;

    // Intercept response to log it
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const statusColor = status >= 400 ? '❌' : '✅';

        console.log(
            `${statusColor} [${new Date().toISOString()}] ${method.padEnd(6)} ${path.padEnd(30)} | Status: ${status} | Duration: ${duration}ms | IP: ${ip}`
        );

        res.send = originalSend;
        return res.send(data);
    };

    next();
};
