// api/home.js
// GET /api/home  featured items (one per title, random order) and library stats
import { loadAllRows, setCors } from "../lib/filesUpstream.js";

const FEATURED_LIMIT = 10;
const norm = (v) => String(v ?? "").trim().replace(/\s+/g, " ").toLowerCase();

function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "GET") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const all = await loadAllRows();

        const seenTitles = new Set();
        const uniqueByTitle = [];
        for (const f of all) {
            const key = norm(f.title);
            if (!key || seenTitles.has(key)) continue;
            seenTitles.add(key);
            uniqueByTitle.push(f);
        }

        const contributors = new Set(all.map((f) => norm(f.email)).filter(Boolean));

        return res.status(200).json({
            ok: true,
            featured: shuffle(uniqueByTitle).slice(0, FEATURED_LIMIT),
            stats: {
                files: all.length,
                titles: uniqueByTitle.length,
                contributors: contributors.size,
            },
        });
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Upstream request failed" });
    }
}
