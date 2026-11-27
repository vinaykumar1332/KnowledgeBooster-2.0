/**
 * KnowledgeHub Backend Server (development)
 *
 * The server owns all data logic: auth, file listing, de-duplication, featured
 * items, stats and uploads. The UI only renders what these endpoints return.
 *
 * Sources (set with env vars, both default to "upstream" = the production Apps Script):
 *   AUTH_SOURCE=upstream|local     FILES_SOURCE=upstream|local
 *   AUTH_URL / FILES_URL           override the upstream Apps Script URLs
 *
 * Auth request contract: POST /api/auth { script: "AUTH", action, ...fields }
 */

import express from 'express';
import cors from 'cors';
import { AUTH_ACTIONS, callAuth } from '../lib/authUpstream.js';
import { buildTaxonomy } from '../lib/filesUpstream.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIG
// ============================================
const AUTH_SOURCE = process.env.AUTH_SOURCE || 'upstream';
const FILES_SOURCE = process.env.FILES_SOURCE || 'upstream';
const UPSTREAM_FILES_URL = process.env.FILES_URL
    || 'https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec';
const FEATURED_LIMIT = 10;

// Vite moves to 5174, 5176, ... when ports are busy, so accept any localhost port
// in addition to FRONTEND_URL.
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
    origin: (origin, callback) => {
        const allowed = !origin || origin === process.env.FRONTEND_URL || LOCALHOST_ORIGIN.test(origin);
        callback(null, allowed);
    },
    credentials: true,
}));
app.use(express.json());

// Local-only stores (used when AUTH_SOURCE / FILES_SOURCE is "local")
const localUsers = new Map();
const localFiles = [];

// ============================================
// HELPERS
// ============================================
const makeToken = (user) =>
    Buffer.from(JSON.stringify({ email: user.email, username: user.username })).toString('base64');

const readToken = (req) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;
    try {
        return JSON.parse(Buffer.from(header.substring(7), 'base64').toString());
    } catch {
        return null;
    }
};

async function postUpstream(url, body) {
    const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const raw = await upstream.text();
    try {
        return JSON.parse(raw);
    } catch {
        throw new Error('Upstream returned a non-JSON response');
    }
}

const norm = (v) => String(v ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/** Drop rows whose visible fields are identical (same rule the UI used before). */
function dedupeRows(rows) {
    const seen = new Set();
    const unique = [];
    for (const r of rows) {
        const sig = JSON.stringify([
            norm(r.username), norm(r.email), norm(r.category), norm(r.subcategory),
            norm(r.title), norm(r.description), norm(r.driveurl), norm(r.fileid), norm(r.thumbnailurl),
        ]);
        if (!seen.has(sig)) {
            seen.add(sig);
            unique.push(r);
        }
    }
    return unique;
}

function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const extractDriveId = (url = '') => {
    const match = String(url).match(/\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? (match[1] || match[2]) : '';
};

/** All files, de-duplicated, newest first. */
async function loadFiles() {
    let rows;
    if (FILES_SOURCE === 'upstream') {
        const data = await postUpstream(UPSTREAM_FILES_URL, { action: 'list', offset: 0, limit: 0 });
        if (!data.ok) throw new Error(data.msg || 'Could not load files');
        rows = Array.isArray(data.rows) ? data.rows : [];
    } else {
        rows = [...localFiles];
    }
    return dedupeRows(rows.slice().reverse());
}

function page(items, offset, limit) {
    const start = Math.max(parseInt(offset, 10) || 0, 0);
    const size = parseInt(limit, 10) || 0; // 0 = everything
    const slice = size > 0 ? items.slice(start, start + size) : items.slice(start);
    return { rows: slice, total: items.length, offset: start, limit: size, hasMore: size > 0 && start + size < items.length };
}

const handleError = (res, err) => {
    console.error('Server error:', err.message);
    res.status(502).json({ ok: false, msg: err.message || 'Upstream request failed' });
};

// ============================================
// ROUTES: health
// ============================================
app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'KnowledgeHub Backend Server', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', message: 'Server is running', uptime: process.uptime(), authSource: AUTH_SOURCE, filesSource: FILES_SOURCE });
});

// ============================================
// AUTH
// ============================================
const authActions = {
    login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ ok: false, msg: 'Email and password required' });
        const user = localUsers.get(email);
        if (!user || user.password !== password) return res.status(401).json({ ok: false, msg: 'Invalid credentials' });
        res.json({ ok: true, msg: 'Login successful', token: makeToken(user), user: { username: user.username, email: user.email } });
    },

    signup(req, res) {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password) return res.status(400).json({ ok: false, msg: 'Missing required fields' });
        if (password !== confirmPassword) return res.status(400).json({ ok: false, msg: 'Passwords do not match' });
        if (password.length < 6) return res.status(400).json({ ok: false, msg: 'Password must be at least 6 characters' });
        if (localUsers.has(email)) return res.status(409).json({ ok: false, msg: 'Email already registered' });
        const user = { username, email, password };
        localUsers.set(email, user);
        res.status(201).json({ ok: true, msg: 'User registered successfully', token: makeToken(user), user: { username, email } });
    },

    verify(req, res) {
        const user = readToken(req);
        if (!user) return res.status(401).json({ ok: false, msg: 'Invalid or missing token' });
        res.json({ ok: true, msg: 'Token verified', user });
    },

    me(req, res) {
        const user = readToken(req);
        if (!user) return res.status(401).json({ ok: false, msg: 'Invalid or missing token' });
        res.json({ ok: true, user });
    },

    logout(req, res) {
        res.json({ ok: true, msg: 'Logout successful' });
    },
};

function runAuthAction(req, res, action) {
    const handler = Object.prototype.hasOwnProperty.call(authActions, action) ? authActions[action] : null;
    if (!handler) return res.status(400).json({ ok: false, msg: `Unknown auth action: ${action}` });
    return handler(req, res);
}

/**
 * Login/signup go to Apps Script (same helper as the Vercel functions), which owns the
 * { script: "AUTH", action } format. Everything else is answered by this server.
 */
async function handleAuth(req, res, action) {
    if (AUTH_SOURCE === 'upstream' && AUTH_ACTIONS.has(action)) {
        try {
            const data = await callAuth(action, req.body || {});
            // Apps Script does not issue tokens; issue one here so uploads (Bearer auth) work locally.
            if (data.ok) data.token = makeToken({ username: data.username, email: data.email });
            return res.json(data);
        } catch (err) {
            return handleError(res, err);
        }
    }
    return runAuthAction(req, res, action);
}

// Current contract used by the UI: the action is in the path, the body holds only the fields
app.post('/api/auth/:action', (req, res) => handleAuth(req, res, req.params.action));

// Older contract, kept for builds that still send { script: "AUTH", action } in the body
app.post('/api/auth', (req, res) => {
    const { script, action } = req.body || {};
    if (script !== 'AUTH') return res.status(400).json({ ok: false, msg: 'Missing or invalid script' });
    return handleAuth(req, res, action);
});

// ============================================
// FILES
// ============================================

/** GET /api/files?offset&limit&email  (limit 0 or missing = all; email = one uploader) */
app.get('/api/files', async (req, res) => {
    try {
        const email = norm(req.query.email);
        const all = (await loadFiles()).filter((f) => !email || norm(f.email) === email);
        const { rows, total, offset, limit, hasMore } = page(all, req.query.offset, req.query.limit);
        res.json({ ok: true, rows, total, offset, limit, hasMore });
    } catch (err) {
        handleError(res, err);
    }
});

/** GET /api/files/search?q= */
app.get('/api/files/search', async (req, res) => {
    try {
        const query = String(req.query.q || '').trim().toLowerCase();
        if (!query) return res.json({ ok: true, rows: [], total: 0 });
        const matches = (await loadFiles()).filter((f) =>
            [f.title, f.description, f.category, f.subcategory, f.username]
                .join(' ').toLowerCase().includes(query)
        );
        const { rows, total, offset, limit, hasMore } = page(matches, req.query.offset, req.query.limit || 20);
        res.json({ ok: true, rows, total, offset, limit, hasMore, query });
    } catch (err) {
        handleError(res, err);
    }
});

/** GET /api/taxonomy : topics (subcategories) in use per audience, most used first */
app.get('/api/taxonomy', async (req, res) => {
    try {
        res.json({ ok: true, categories: buildTaxonomy(await loadFiles()) });
    } catch (err) {
        handleError(res, err);
    }
});

/** GET /api/home : featured items and stats for the landing page */
app.get('/api/home', async (req, res) => {
    try {
        const all = await loadFiles();
        const seenTitles = new Set();
        const uniqueByTitle = [];
        for (const f of all) {
            const key = norm(f.title);
            if (!key || seenTitles.has(key)) continue;
            seenTitles.add(key);
            uniqueByTitle.push(f);
        }
        const contributors = new Set(all.map((f) => norm(f.email)).filter(Boolean));
        res.json({
            ok: true,
            featured: shuffle(uniqueByTitle).slice(0, FEATURED_LIMIT),
            stats: {
                files: all.length,
                titles: uniqueByTitle.length,
                contributors: contributors.size,
            },
        });
    } catch (err) {
        handleError(res, err);
    }
});

/** POST /api/files/upload  (Bearer token required; identity comes from the token, not the body) */
app.post('/api/files/upload', async (req, res) => {
    const user = readToken(req);
    if (!user) return res.status(401).json({ ok: false, msg: 'Not authenticated' });

    const { title, description = '', category = 'student', subcategory = 'Notes', driveUrl, thumbnailUrl = '' } = req.body || {};
    if (!title || !driveUrl) return res.status(400).json({ ok: false, msg: 'Title and driveUrl are required' });

    const fileid = extractDriveId(driveUrl);
    if (!fileid) return res.status(400).json({ ok: false, msg: 'Invalid Google Drive link' });

    // Duplicate check: same fileId or same title already in the sheet
    try {
        const existing = await loadFiles();
        const normTitle = norm(title);
        const dupFile = existing.find((f) => f.fileid && f.fileid === fileid);
        if (dupFile) {
            return res.status(409).json({
                ok: false,
                duplicate: true,
                duplicateType: 'file',
                msg: `This file is already in the library (shared by ${dupFile.username || 'another user'}).`,
            });
        }
        const dupTitle = existing.find((f) => norm(f.title) === normTitle);
        if (dupTitle) {
            return res.status(409).json({
                ok: false,
                duplicate: true,
                duplicateType: 'title',
                msg: `A file titled "${dupTitle.title}" already exists. Try a more specific title.`,
            });
        }
    } catch {
        // duplicate check failed — still attempt the upload rather than blocking
    }

    const record = {
        timestamp: new Date().toString(),
        username: user.username,
        email: user.email,
        category,
        subcategory,
        title,
        description,
        driveurl: driveUrl,
        fileid,
        thumbnailurl: thumbnailUrl,
    };

    try {
        if (FILES_SOURCE === 'upstream') {
            // Field names must match saveFile() in the Apps Script (camelCase)
            const data = await postUpstream(UPSTREAM_FILES_URL, {
                action: 'save',
                username: record.username,
                email: record.email,
                category,
                subcategory,
                title,
                description,
                driveUrl,
                fileId: fileid,
                thumbnailUrl,
            });
            return res.status(data.ok ? 201 : 400).json({
                ok: data.ok === true,
                msg: data.msg || data.error || (data.ok ? 'File saved' : 'Save failed'),
                duplicate: data.duplicate === true,
            });
        }
        localFiles.push(record);
        return res.status(201).json({ ok: true, msg: 'File saved', file: record });
    } catch (err) {
        handleError(res, err);
    }
});

app.delete('/api/files/:fileId', (req, res) => {
    const user = readToken(req);
    if (!user) return res.status(401).json({ ok: false, msg: 'Not authenticated' });
    if (FILES_SOURCE === 'upstream') {
        return res.status(501).json({ ok: false, msg: 'Delete is not supported by the upstream store yet' });
    }
    const index = localFiles.findIndex((f) => f.fileid === req.params.fileId);
    if (index === -1) return res.status(404).json({ ok: false, msg: 'File not found' });
    if (localFiles[index].email !== user.email) return res.status(403).json({ ok: false, msg: 'Not authorized' });
    localFiles.splice(index, 1);
    res.json({ ok: true, msg: 'File deleted' });
});

// ============================================
// 404 + START
// ============================================
app.use((req, res) => {
    res.status(404).json({ ok: false, msg: 'Endpoint not found', path: req.originalUrl });
});

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('KnowledgeHub Backend Server Started');
    console.log(`URL: http://localhost:${PORT}   auth=${AUTH_SOURCE}   files=${FILES_SOURCE}`);
    console.log('='.repeat(60) + '\n');
});

export default app;
