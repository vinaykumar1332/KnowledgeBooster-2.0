// src/services/apiClient.js
// The only place the UI talks HTTP. It calls the app's own /api endpoints; the server
// decides where the data really lives (Apps Script, Google Sheets) and in what format.
import { API_CONFIG } from "../config/Api.config";
import { UI_CONFIG } from "../config/ui.config";

function authHeader() {
    try {
        const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
        return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
    } catch {
        return {};
    }
}

function buildUrl(path, query) {
    const url = new URL(`${API_CONFIG.BASE_URL}${path}`, window.location.origin);
    for (const [key, value] of Object.entries(query || {})) {
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    return url;
}

/**
 * Always resolves (never throws) to an object with `ok` and, on failure, a readable `msg`.
 */
async function request(method, path, { query, body } = {}) {
    try {
        const res = await fetch(buildUrl(path, query), {
            method,
            headers: { ...API_CONFIG.HEADERS, ...authHeader() },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (data && typeof data === "object") {
            return "ok" in data ? data : { ...data, ok: res.ok };
        }
        // Non-JSON reply: in development this usually means the backend is not running
        return { ok: false, msg: res.status >= 500 ? UI_CONFIG.ERRORS.SERVER_ERROR : UI_CONFIG.ERRORS.GENERIC_ERROR };
    } catch {
        return { ok: false, msg: UI_CONFIG.ERRORS.NETWORK_ERROR };
    }
}

export const api = {
    get: (path, query) => request("GET", path, { query }),
    post: (path, body) => request("POST", path, { body }),
};

export default api;
