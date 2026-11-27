// src/services/filesService.js
import { api } from "./apiClient";
import { ENDPOINTS } from "../config/endpoints";
import { PAGINATION } from "../constants";
import { sanitizeUploadPayload } from "../utils/sanitize";

/**
 * Files, newest first. limit 0 = all. email = only that uploader's files.
 * @returns {Promise<{ ok, rows[], total, hasMore, msg? }>}
 */
export function fetchFiles({ offset = 0, limit = PAGINATION.FILES_LIMIT, email } = {}) {
    const query = {};
    if (offset > 0) query.offset = offset;
    if (limit > 0) query.limit = limit;
    if (email) query.email = email;
    return api.get(ENDPOINTS.FILES.LIST, query);
}

/**
 * Full-text search across title, description, topic, uploader.
 * @returns {Promise<{ ok, rows[], total, msg? }>}
 */
export function searchFiles(q, { offset = 0, limit = PAGINATION.FILES_LIMIT } = {}) {
    const query = { q };
    if (offset > 0) query.offset = offset;
    if (limit > 0) query.limit = limit;
    return api.get(ENDPOINTS.FILES.SEARCH, query);
}

/**
 * Featured files + library stats for the home page.
 * @returns {Promise<{ ok, featured[], stats:{ files, titles, contributors } }>}
 */
export function fetchHome() {
    return api.get(ENDPOINTS.HOME);
}

/**
 * Topics per audience, most used first (drives the upload topic picker).
 * @returns {Promise<{ ok, categories:{ student[], professional[], others[] } }>}
 */
export function fetchTaxonomy() {
    return api.get(ENDPOINTS.TAXONOMY);
}

/**
 * Save one file record to the sheet.
 * Payload is sanitized before sending.
 * @returns {Promise<{ ok, msg?, duplicate?, duplicateType? }>}
 */
export function saveFileMetadata(payload) {
    return api.post(ENDPOINTS.FILES.UPLOAD, sanitizeUploadPayload(payload));
}
