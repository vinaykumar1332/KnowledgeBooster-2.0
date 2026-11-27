import { Router } from 'express';
import { AUTH_SOURCE } from '../config.js';
import { makeToken, readToken, localUsers, postUpstream, handleError } from '../utils/helpers.js';
import { AUTH_ACTIONS, callAuth } from '../../lib/authUpstream.js';

const router = Router();

// ─── Local auth handlers (AUTH_SOURCE=local) ──────────────────────────────────

const localHandlers = {
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

    logout(_req, res) {
        res.json({ ok: true, msg: 'Logout successful' });
    },
};

async function handleAuth(req, res, action) {
    if (AUTH_SOURCE === 'upstream' && AUTH_ACTIONS.has(action)) {
        try {
            const data = await callAuth(action, req.body || {});
            if (data.ok) data.token = makeToken({ username: data.username, email: data.email });
            return res.json(data);
        } catch (err) {
            return handleError(res, err);
        }
    }
    const handler = Object.prototype.hasOwnProperty.call(localHandlers, action) ? localHandlers[action] : null;
    if (!handler) return res.status(400).json({ ok: false, msg: `Unknown auth action: ${action}` });
    return handler(req, res);
}

// POST /api/auth/:action  — action in URL path
router.post('/:action', (req, res) => handleAuth(req, res, req.params.action));

// POST /api/auth  — older contract: { script: "AUTH", action } in body
router.post('/', (req, res) => {
    const { script, action } = req.body || {};
    if (script !== 'AUTH') return res.status(400).json({ ok: false, msg: 'Missing or invalid script' });
    return handleAuth(req, res, action);
});

export default router;
