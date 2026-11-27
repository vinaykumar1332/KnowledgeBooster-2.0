/**
 * Authentication Service
 * Every call posts to one endpoint (API_CONFIG.AUTH_URL) with
 * { script: "AUTH", action, ...fields } in the body, matching the Apps Script contract.
 */

import { API_CONFIG } from "../config/Api.config";

async function postAuth(action, fields = {}, token) {
    try {
        const headers = token
            ? { ...API_CONFIG.HEADERS, Authorization: `Bearer ${token}` }
            : API_CONFIG.HEADERS;

        const response = await fetch(API_CONFIG.AUTH_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({ script: "AUTH", action, ...fields }),
        });

        const data = await response.json().catch(() => ({ ok: false, msg: "Invalid server response" }));
        return data;
    } catch (err) {
        console.error(`Auth "${action}" failed:`, err);
        return { ok: false, msg: "Connection failed" };
    }
}

/** Flatten the server response into the shape the UI stores in sessionStorage. */
function toSession(data) {
    return {
        ok: data.ok === true,
        token: data.token,
        username: data.user?.username ?? data.username,
        email: data.user?.email ?? data.email,
        msg: data.msg,
    };
}

export async function login({ email, password }) {
    const data = await postAuth("login", { email: email.trim(), password });
    return toSession(data);
}

export async function signup({ username, email, password, confirmPassword }) {
    const data = await postAuth("signup", {
        username,
        email: email.trim(),
        password,
        confirmPassword,
    });
    return toSession(data);
}

export async function verifyToken(token) {
    const data = await postAuth("verify", {}, token);
    return { ok: data.ok === true, user: data.user, msg: data.msg };
}

export async function getCurrentUser(token) {
    const data = await postAuth("me", {}, token);
    return { ok: data.ok === true, user: data.user, msg: data.msg };
}

export async function logout() {
    const data = await postAuth("logout");
    return { ok: data.ok === true, msg: data.msg };
}
