// Shared helpers for the Vercel file routes (api/files.js, api/home.js, api/files/upload.js).
// Lives outside api/ so Vercel does not treat it as a route.
// cspell:ignore driveurl thumbnailurl

export const FILES_URL =
    process.env.FILES_URL
    || process.env.VITE_FILES_URL
    || "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec";

/** POST a JSON body to the Apps Script backend and return its parsed JSON. */
export async function callUpstream(body) {
    const upstream = await fetch(FILES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const raw = await upstream.text();
    try {
        return JSON.parse(raw);
    } catch {
        return { ok: false, msg: "Upstream returned a non-JSON response" };
    }
}

/** Load every row from the sheet (limit 0 = all), newest first, without duplicates. */
export async function loadAllRows() {
    const data = await callUpstream({ action: "list", offset: 0, limit: 0 });
    if (!data.ok) throw new Error(data.msg || "Could not load files");
    const rows = Array.isArray(data.rows) ? data.rows : [];
    return dedupeRows(rows.slice().reverse());
}

const norm = (v) => String(v ?? "").trim().replace(/\s+/g, " ").toLowerCase();

/** Drops rows whose visible fields are identical to an earlier row. */
export function dedupeRows(rows) {
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

/**
 * Topics (subcategories) people actually use, per audience, most used first.
 * Different spellings of the same topic ("notes", "Notes ") are counted together.
 * @returns {{ [category: string]: { name: string, count: number }[] }}
 */
export function buildTaxonomy(rows, perCategory = 12) {
    const byCategory = {};
    for (const r of rows) {
        const category = norm(r.category) || "others";
        const name = String(r.subcategory ?? "").trim().replace(/\s+/g, " ");
        if (!name) continue;
        const key = name.toLowerCase();
        byCategory[category] ??= new Map();
        const entry = byCategory[category].get(key) || { name, count: 0 };
        entry.count += 1;
        byCategory[category].set(key, entry);
    }
    const result = {};
    for (const [category, topics] of Object.entries(byCategory)) {
        result[category] = [...topics.values()]
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
            .slice(0, perCategory);
    }
    return result;
}

/** Slices a list. offset and limit may be missing or strings; limit 0 (or missing) means everything. */
export function page(items, offset, limit) {
    const start = Math.max(parseInt(offset, 10) || 0, 0);
    const size = parseInt(limit, 10) || 0;
    const slice = size > 0 ? items.slice(start, start + size) : items.slice(start);
    return {
        rows: slice,
        total: items.length,
        offset: start,
        limit: size,
        hasMore: size > 0 && start + size < items.length,
    };
}

// Re-exported so existing routes can keep importing them from here
export { setCors, readBody } from "./http.js";

export function extractDriveId(url = "") {
    const match = String(url).match(/\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? (match[1] || match[2]) : "";
}
