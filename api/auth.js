// POST /api/auth  { script:"AUTH", action:"login"|"signup", ...fields }
// Simple passthrough to the Google Apps Script auth backend.
import { setCors, readBody } from "../lib/http.js";

const AUTH_URL =
    process.env.AUTH_URL ||
    "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const body = await readBody(req);
        const upstream = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const raw = await upstream.text();
        try {
            return res.status(200).json(JSON.parse(raw));
        } catch {
            return res.status(502).json({ ok: false, msg: "Auth server returned non-JSON" });
        }
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Auth request failed" });
    }
}
