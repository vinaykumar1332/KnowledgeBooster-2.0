// src/services/filesService.js
import { API_CONFIG_FILES } from "../config/Api.config";

async function safeParse(res) {
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return { ok: false, error: "Invalid server response", proxiedText: txt };
  }
}

export async function saveFileMetadata(payload) {
  const useDirect = API_CONFIG_FILES.USE_DIRECT_FILES;
  const endpoint = useDirect ? API_CONFIG_FILES.FILES_URL : API_CONFIG_FILES.PROXY_URL;
  const body = useDirect ? JSON.stringify(payload) : JSON.stringify({ script: "FILES", action: "save", ...payload });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: API_CONFIG_FILES.HEADERS,
      body,
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("saveFileMetadata network error:", res.status, res.statusText, t);
      return { ok: false, error: `Network error ${res.status}`, proxiedText: t };
    }

    return await safeParse(res);
  } catch (err) {
    console.error("saveFileMetadata exception:", err);
    return { ok: false, error: String(err) };
  }
}

export async function fetchFiles() {
  const useDirect = API_CONFIG_FILES.USE_DIRECT_FILES;
  if (useDirect) {
    try {
      const res = await fetch(API_CONFIG_FILES.FILES_URL, { method: "GET", headers: API_CONFIG_FILES.HEADERS });
      if (!res.ok) {
        const t = await res.text();
        return { ok: false, error: `Network error ${res.status}`, proxiedText: t };
      }
      return await safeParse(res);
    } catch (err) {
      console.error("fetchFiles exception:", err);
      return { ok: false, error: String(err) };
    }
  } else {
    try {
      const res = await fetch(API_CONFIG_FILES.PROXY_URL, {
        method: "POST",
        headers: API_CONFIG_FILES.HEADERS,
        body: JSON.stringify({ script: "FILES", action: "list" }),
      });
      if (!res.ok) {
        const t = await res.text();
        return { ok: false, error: `Network error ${res.status}`, proxiedText: t };
      }
      return await safeParse(res);
    } catch (err) {
      console.error("fetchFiles exception:", err);
      return { ok: false, error: String(err) };
    }
  }
}
