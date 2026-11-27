/**
 * API configuration for the UI.
 * Same-origin "/api" everywhere: Vercel serves it in production, and the Vite dev server
 * proxies it to the local backend (see vite.config.js). Set VITE_API_URL to point elsewhere.
 */
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const API_CONFIG = {
    BASE_URL: API_BASE,
    HEADERS: {
        "Content-Type": "application/json",
    },
};
