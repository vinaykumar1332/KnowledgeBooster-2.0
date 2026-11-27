// src/services/authService.js
// Names the auth endpoints. Request formats for Apps Script live on the server.
import { api } from "./apiClient";

/** Flatten the server response into the shape the UI stores in sessionStorage. */
function toSession(data) {
    return {
        ok: data.ok === true,
        token: data.token,
        username: data.user?.username ?? data.username,
        email: data.user?.email ?? data.email,
        userType: data.user?.userType ?? data.userType ?? "",
        msg: data.msg,
    };
}

export async function login({ email, password }) {
    return toSession(
        await api.post("/auth", { script: "AUTH", action: "login", email: email.trim(), password })
    );
}

export async function signup({ username, email, password, confirmPassword, userType }) {
    return toSession(
        await api.post("/auth", {
            script: "AUTH",
            action: "signup",
            username,
            email: email.trim(),
            password,
            confirmPassword,
            userType,
        })
    );
}
