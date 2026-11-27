// POST /api/auth/login  { email, password }
import { setCors, readBody } from "../../lib/http.js";
import { callAuth } from "../../lib/authUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const { email, password } = await readBody(req);
        if (!email || !password) return res.status(400).json({ ok: false, msg: "Email and password are required" });

        const data = await callAuth("login", { email, password });
        return res.status(data.ok ? 200 : 401).json(data);
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Could not reach the auth server" });
    }
}
