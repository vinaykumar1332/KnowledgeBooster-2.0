// Talks to the Google Apps Script auth backend. Only the server knows its URL and
// its request format ({ script: "AUTH", action, ...fields }); the UI never does.

export const AUTH_URL =
    process.env.AUTH_URL
    || process.env.VITE_AUTH_URL
    || "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec";

/** Actions the UI may request. Anything else is rejected before it reaches Apps Script. */
export const AUTH_ACTIONS = new Set(["login", "signup"]);

/** Fields forwarded for each action, so stray body fields never reach the upstream. */
const ACTION_FIELDS = {
    login: ["email", "password"],
    signup: ["username", "email", "password", "confirmPassword", "userType"],
};

export async function callAuth(action, body = {}) {
    const payload = { script: "AUTH", action };
    for (const key of ACTION_FIELDS[action] || []) {
        if (body[key] !== undefined) payload[key] = body[key];
    }

    const upstream = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const raw = await upstream.text();
    try {
        return JSON.parse(raw);
    } catch {
        return { ok: false, msg: "Auth server returned a non-JSON response" };
    }
}
