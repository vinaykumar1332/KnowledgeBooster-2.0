// src/services/filesService.js
import { API_CONFIG_FILES } from "../config/Api.config";
export async function saveFileMetadata(payload) {
  const body = API_CONFIG_FILES.USE_DIRECT_FILES
    ? JSON.stringify({ ...payload }) // direct Apps Script expects JSON payload
    : JSON.stringify({ script: "FILES", action: "save", ...payload }); // proxy expects script/action

  const endpoint = API_CONFIG_FILES.USE_DIRECT_FILES ? API_CONFIG_FILES.FILES_URL : API_CONFIG_FILES.PROXY_URL;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: API_CONFIG_FILES.HEADERS,
    body,
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid server response", proxiedText: text };
  }
}

export async function fetchFiles() {
  if (API_CONFIG_FILES.USE_DIRECT_FILES) {
    const res = await fetch(API_CONFIG_FILES.FILES_URL, {
      method: "GET",
      headers: API_CONFIG_FILES.HEADERS,
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: "Invalid server response", proxiedText: text };
    }
  } else {
    // call proxy with script=FILES & action=list
    const res = await fetch(API_CONFIG_FILES.PROXY_URL, {
      method: "POST",
      headers: API_CONFIG_FILES.HEADERS,
      body: JSON.stringify({ script: "FILES", action: "list" }),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: "Invalid server response", proxiedText: text };
    }
  }
}
