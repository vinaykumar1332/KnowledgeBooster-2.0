import express from 'express';
import cors from 'cors';
import { FRONTEND_URL, LOCALHOST_ORIGIN } from './config.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import filesRouter from './routes/files.js';
import homeRouter from './routes/home.js';
import youtubeRouter from './routes/youtube.js';

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowed = !origin || origin === FRONTEND_URL || LOCALHOST_ORIGIN.test(origin);
        callback(null, allowed);
    },
    credentials: true,
}));

app.use(express.json());

// Routes
app.use('/', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/files', filesRouter);
app.use('/api', homeRouter);          // mounts /api/home and /api/taxonomy
app.use('/api/youtube', youtubeRouter);

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ ok: false, msg: 'Endpoint not found', path: req.originalUrl });
});

export default app;
