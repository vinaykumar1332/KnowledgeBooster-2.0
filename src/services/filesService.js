/**
 * Files Service
 * Handles file operations with backend API
 */

import { API_CONFIG } from "../config/Api.config";

/**
 * Safe JSON parsing
 */
async function safeParse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid server response", raw: text };
  }
}

/**
 * Get authorization headers with token
 */
function getAuthHeaders() {
  const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
  const token = auth?.token;

  if (!token) {
    return API_CONFIG.HEADERS;
  }

  return {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Save/Upload file metadata
 * @param {Object} payload - File metadata
 * @returns {Promise} - { ok, file, msg }
 */
export async function saveFileMetadata(payload) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/files/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await safeParse(res);
  } catch (err) {
    console.error('Save file error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}

/**
 * Fetch all files
 * @param {Object} options - { offset, limit, category }
 * @returns {Promise} - { ok, rows, total, hasMore }
 */
export async function fetchFiles({ offset = 0, limit = 20, category } = {}) {
  try {
    let url = `${API_CONFIG.BASE_URL}/files?offset=${offset}&limit=${limit}`;

    if (category && category !== 'all') {
      url += `&category=${category}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    });

    return await safeParse(res);
  } catch (err) {
    console.error('Fetch files error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}

/**
 * Search files
 * @param {String} query - Search query
 * @param {Object} options - { offset, limit }
 * @returns {Promise} - { ok, rows, total }
 */
export async function searchFiles(query, { offset = 0, limit = 20 } = {}) {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/files/search?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: API_CONFIG.HEADERS,
      }
    );

    return await safeParse(res);
  } catch (err) {
    console.error('Search files error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}

/**
 * Get specific file
 * @param {Number} fileId - File ID
 * @returns {Promise} - { ok, file }
 */
export async function getFile(fileId) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/files/${fileId}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    });

    return await safeParse(res);
  } catch (err) {
    console.error('Get file error:', err);
    return {
      ok: false,
      error: String(err),
    };
  }
}

/**
 * Update file
 * @param {Number} fileId - File ID
 * @param {Object} data - Updated data
 * @returns {Promise} - { ok, file, msg }
 */
export async function updateFile(fileId, data) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/files/${fileId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return await safeParse(res);
  } catch (err) {
    console.error('Update file error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}

/**
 * Delete file
 * @param {Number} fileId - File ID
 * @returns {Promise} - { ok, msg }
 */
export async function deleteFile(fileId) {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/files/${fileId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return await safeParse(res);
  } catch (err) {
    console.error('Delete file error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}

/**
 * Get user's uploaded files
 * @param {Object} options - { offset, limit }
 * @returns {Promise} - { ok, rows, total }
 */
/**
 * Landing page data: featured items and stats, computed by the server.
 * @returns {Promise} - { ok, featured, stats: { files, titles, contributors } }
 */
export async function fetchHome() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/home`, { method: "GET", headers: API_CONFIG.HEADERS });
    return await safeParse(res);
  } catch (err) {
    console.error('Fetch home error:', err);
    return { ok: false, error: String(err) };
  }
}

export async function getUserFiles({ offset = 0, limit = 20 } = {}) {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/files/user/me?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return await safeParse(res);
  } catch (err) {
    console.error('Get user files error:', err);
    return {
      ok: false,
      error: String(err),
      msg: 'Connection error',
    };
  }
}
