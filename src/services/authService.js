// authService.js
import { API_CONFIG } from "../config/Api.config";

  const payload = {
    action: "login",
    email: email.trim(),
    password
  };
  const res = await fetch(API_CONFIG.AUTH_URL, {
    method: "POST",
    headers: API_CONFIG.HEADERS,
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function signup({ username, email, password, userType }) {
  const payload = { action: "signup", username, email, password, userType };
  const res = await fetch(API_CONFIG.AUTH_URL, {
    method: "POST",
    headers: API_CONFIG.HEADERS,
    body: JSON.stringify(payload)
  });
  return await res.json();
}
