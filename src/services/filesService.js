// src/services/filesService.js
// Names the file endpoints. De-duplication, ordering, filtering by uploader and the
// Apps Script format all happen on the server.
import { api } from "./apiClient";

/**
 * Files, newest first. limit 0 = all. email = only that uploader's files.
 * @returns {Promise<{ ok: boolean, rows?: object[], total?: number, hasMore?: boolean, msg?: string }>}
 */
export function fetchFiles({ offset = 0, limit = 20, email } = {}) {
    return api.get("/files", { offset, limit, email });
}

/**
 * Landing page data: featured items and library stats.
 * @returns {Promise<{ ok: boolean, featured?: object[], stats?: { files: number, titles: number, contributors: number } }>}
 */
export function fetchHome() {
    return api.get("/home");
}

/**
 * Topics (subcategories) in use per audience, most used first.
 * @returns {Promise<{ ok: boolean, categories?: { [category: string]: { name: string, count: number }[] } }>}
 */
export function fetchTaxonomy() {
    return api.get("/taxonomy");
}

/**
 * Saves one file's details (title, description, category, subcategory, driveUrl, ...).
 * @returns {Promise<{ ok: boolean, msg?: string }>}
 */
export function saveFileMetadata(payload) {
    return api.post("/files/upload", payload);
}
