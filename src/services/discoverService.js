import { ENDPOINTS } from "../config/endpoints";

const BASE = "/api";

/**
 * Unified discover search.
 * @param {string} q
 * @param {{ page?: number, ytToken?: string, signal?: AbortSignal }} opts
 * @returns {Promise<{ ok, q, page, cached?, providers: { pdfs, videos, articles } }>}
 */
export async function discoverSearch(q, { page = 1, ytToken, signal } = {}) {
    const url = new URL(`${BASE}${ENDPOINTS.DISCOVER.SEARCH}`, window.location.origin);
    url.searchParams.set("q", q);
    if (page > 1) url.searchParams.set("page", page);
    if (ytToken) url.searchParams.set("ytToken", ytToken);

    try {
        const res = await fetch(url, { signal });
        const data = await res.json().catch(() => null);
        if (data && typeof data === "object") return data;
        return { ok: false, msg: "Server error" };
    } catch (err) {
        if (err?.name === "AbortError") return { ok: false, aborted: true };
        return { ok: false, msg: "Network error — check your connection." };
    }
}
