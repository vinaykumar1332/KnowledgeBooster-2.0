// POST /api/auth/signup  { username, email, password, confirmPassword, userType }
import { setCors, readBody } from "../../lib/http.js";
import { callAuth } from "../../lib/authUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const { username, email, password, confirmPassword, userType } = await readBody(req);
        if (!username || !email || !password) return res.status(400).json({ ok: false, msg: "Name, email and password are required" });

        const data = await callAuth("signup", { username, email, password, confirmPassword, userType });
        return res.status(data.ok ? 201 : 400).json(data);
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Could not reach the auth server" });
    }
}
