// api/taxonomy.js
// GET /api/taxonomy  topics (subcategories) in use per audience, most used first
import { buildTaxonomy, loadAllRows, setCors } from "../lib/filesUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "GET") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const rows = await loadAllRows();
        return res.status(200).json({ ok: true, categories: buildTaxonomy(rows) });
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Upstream request failed" });
    }
}
