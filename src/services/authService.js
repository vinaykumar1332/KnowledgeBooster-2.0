// authService.js
import API_CONFIG from "../config/Api.config";

export async function login({ email, password }) {
  const payload = {
    script: "AUTH",
    action: "login",
    email: email.trim(),
    password
  };

  if (API_CONFIG.USE_DIRECT) {
    // direct call to Apps Script
    const res = await fetch(API_CONFIG.AUTH_URL, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(payload)
    });
    return await res.json();
  } else {
    const res = await fetch(API_CONFIG.PROXY_URL, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
}

export async function signup({ username, email, password, userType }) {
  const payload = { script: "AUTH", action: "signup", username, email, password, userType };
  const endpoint = API_CONFIG.USE_DIRECT ? API_CONFIG.AUTH_URL : API_CONFIG.PROXY_URL;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: API_CONFIG.HEADERS,
    body: JSON.stringify(payload)
  });
  return await res.json();
}
