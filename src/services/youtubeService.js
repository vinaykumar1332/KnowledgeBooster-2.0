import { api } from "./apiClient";
import { ENDPOINTS } from "../config/endpoints";

/**
 * Search YouTube videos via the local server proxy.
 * @param {string} q - search query
 * @param {{ maxResults?: number, pageToken?: string }} opts
 * @returns {Promise<{ ok, items[], total, nextPageToken, prevPageToken, msg? }>}
 */
export function searchYouTube(q, { maxResults = 12, pageToken } = {}) {
    const query = { q, maxResults };
    if (pageToken) query.pageToken = pageToken;
    return api.get(ENDPOINTS.YOUTUBE.SEARCH, query);
}
