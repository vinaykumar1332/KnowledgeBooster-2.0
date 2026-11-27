import { Router } from 'express';
import { AUTH_SOURCE, FILES_SOURCE } from '../config.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json({ status: 'success', message: 'KnowledgeHub Backend Server', version: '1.0.0', timestamp: new Date().toISOString() });
});

router.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', message: 'Server is running', uptime: process.uptime(), authSource: AUTH_SOURCE, filesSource: FILES_SOURCE });
});

export default router;
