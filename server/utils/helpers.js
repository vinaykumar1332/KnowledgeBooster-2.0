// server/utils/helpers.js — shared utilities used across route handlers
import { FILES_SOURCE, UPSTREAM_FILES_URL } from '../config.js';

// ─── Token helpers ──────────────────────────────────────────────────────────

/** Create a base64 token from user identity (dev only — not cryptographically signed). */
export const makeToken = (user) =>
    Buffer.from(JSON.stringify({ email: user.email, username: user.username })).toString('base64');

/** Extract the user payload from a Bearer token, or return null. */
export const readToken = (req) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;
    try {
        return JSON.parse(Buffer.from(header.substring(7), 'base64').toString());
    } catch {
        return null;
    }
};

// ─── Upstream helpers ────────────────────────────────────────────────────────

/** POST JSON to a Google Apps Script /exec URL and return the parsed response. */
export async function postUpstream(url, body) {
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

// ─── Data helpers ────────────────────────────────────────────────────────────

/** Normalise a value for comparison: trim, collapse spaces, lowercase. */
export const norm = (v) => String(v ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/** Remove rows whose core fields are identical. */
export function dedupeRows(rows) {
    const seen = new Set();
    const unique = [];
    for (const r of rows) {
        const sig = JSON.stringify([
            norm(r.username), norm(r.email), norm(r.category), norm(r.subcategory),
            norm(r.title), norm(r.description), norm(r.driveurl), norm(r.fileid), norm(r.thumbnailurl),
        ]);
        if (!seen.has(sig)) { seen.add(sig); unique.push(r); }
    }
    return unique;
}

/** Fisher-Yates shuffle (returns a new array). */
export function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/** Extract a Drive file ID from a share URL. */
export const extractDriveId = (url = '') => {
    const match = String(url).match(/\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? (match[1] || match[2]) : '';
};

// ─── In-memory local stores (used when FILES_SOURCE / AUTH_SOURCE = "local") ──

export const localUsers = new Map();
export const localFiles = [];

// ─── File loading ─────────────────────────────────────────────────────────────

/** Load all files, de-duplicated, newest first. */
export async function loadFiles() {
    let rows;
    if (FILES_SOURCE === 'upstream') {
        const data = await postUpstream(UPSTREAM_FILES_URL, { action: 'list' });
        if (!data.ok) throw new Error(data.msg || 'Could not load files');
        rows = Array.isArray(data.rows) ? data.rows : [];
    } else {
        rows = [...localFiles];
    }
    return dedupeRows(rows.slice().reverse());
}

// ─── Pagination ───────────────────────────────────────────────────────────────

/** Slice an array by offset/limit. limit 0 = all. */
export function page(items, offset, limit) {
    const start = Math.max(parseInt(offset, 10) || 0, 0);
    const size = parseInt(limit, 10) || 0;
    const slice = size > 0 ? items.slice(start, start + size) : items.slice(start);
    return { rows: slice, total: items.length, offset: start, limit: size, hasMore: size > 0 && start + size < items.length };
}

// ─── Error handler ────────────────────────────────────────────────────────────

export const handleError = (res, err) => {
    console.error('Server error:', err.message);
    res.status(502).json({ ok: false, msg: err.message || 'Upstream request failed' });
};
