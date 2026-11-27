// api/auth/[action].js
// POST /api/auth/login   { email, password }
// POST /api/auth/signup  { username, email, password, confirmPassword, userType }
// POST /api/auth/logout  (stateless: nothing to clear on the server)
// The server adds the Apps Script format; the older POST /api/auth (api/auth.js) still works.
import { setCors, readBody } from "../../lib/http.js";
import { AUTH_ACTIONS, callAuth } from "../../lib/authUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    const action = String(req.query?.action || "");
    if (action === "logout") return res.status(200).json({ ok: true, msg: "Logout successful" });
    if (!AUTH_ACTIONS.has(action)) return res.status(404).json({ ok: false, msg: `Unknown auth action: ${action}` });

    try {
        const body = await readBody(req);
        const data = await callAuth(action, body);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Could not reach the auth server" });
    }
}
