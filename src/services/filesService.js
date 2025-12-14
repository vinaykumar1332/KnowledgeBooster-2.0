import { API_CONFIG_FILES } from "../config/Api.config";

async function safeParse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid server response", raw: text };
  }
}

export async function saveFileMetadata(payload) {
  try {
    const res = await fetch(API_CONFIG_FILES.PROXY_URL, {
      method: "POST",
      headers: API_CONFIG_FILES.HEADERS,
      body: JSON.stringify({
        action: "save",         
        ...payload,
      }),
    });
    return await safeParse(res);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function fetchFiles() {
  try {
    const res = await fetch(API_CONFIG_FILES.PROXY_URL, {
      method: "POST",
      headers: API_CONFIG_FILES.HEADERS,
      body: JSON.stringify({
        action: "list",          
      }),
    });
    return await safeParse(res);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
