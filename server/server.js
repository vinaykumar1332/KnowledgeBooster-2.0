/**
 * KnowledgeHub Backend Server
 * Express.js REST API for file management and authentication
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { limiter } from './middleware/rateLimiter.js';
import { securityHeaders } from './middleware/securityHeaders.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import filesRoutes from './routes/files.routes.js';
import healthRoutes from './routes/health.routes.js';

// Load environment variables
dotenv.config();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// Security Middleware
// ============================================
app.use(helmet());
app.use(securityHeaders);

// ============================================
// CORS Configuration
// ============================================
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ============================================
// Body Parser & Compression
// ============================================
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// Logging & Monitoring
// ============================================
app.use(requestLogger);

// ============================================
// Rate Limiting
// ============================================
app.use('/api/', limiter);

// ============================================
// API Routes
// ============================================
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);

// ============================================
// Root Endpoint
// ============================================
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'KnowledgeHub Backend Server',
        version: '1.0.0',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
    });
});

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 KnowledgeHub Backend Server Started');
    console.log('='.repeat(60));
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🔄 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('='.repeat(60) + '\n');
});

// ============================================
// Graceful Shutdown
// ============================================
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('⚠️  SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
