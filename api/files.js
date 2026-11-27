// api/files.js
// GET  /api/files?offset=&limit=&email=   list files (missing offset/limit = all; email = one uploader)
// POST /api/files                  pass-through for the older { action, ... } body contract
import { callUpstream, loadAllRows, page, readBody, setCors } from "../lib/filesUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();

    try {
        if (req.method === "GET") {
            const email = String(req.query?.email || "").trim().toLowerCase();
            const all = await loadAllRows();
            const rows = email ? all.filter((r) => String(r.email || "").trim().toLowerCase() === email) : all;
            return res.status(200).json({ ok: true, ...page(rows, req.query?.offset, req.query?.limit) });
        }

        if (req.method === "POST") {
            const body = await readBody(req);
            const data = await callUpstream(body);
            return res.status(data.ok ? 200 : 400).json(data);
        }

        return res.status(405).json({ ok: false, msg: "Method not allowed" });
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Upstream request failed" });
    }
}
