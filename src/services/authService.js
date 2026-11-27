// src/services/authService.js
import { api } from "./apiClient";
import { ENDPOINTS } from "../config/endpoints";
import { trimmed } from "../utils/sanitize";

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
        await api.post(ENDPOINTS.AUTH.ROOT, {
            script: "AUTH",
            action: "login",
            email: trimmed(email),
            password,
        })
    );
}

export async function signup({ username, email, password, confirmPassword, userType }) {
    return toSession(
        await api.post(ENDPOINTS.AUTH.ROOT, {
            script: "AUTH",
            action: "signup",
            username: trimmed(username),
            email: trimmed(email),
            password,
            confirmPassword,
            userType,
        })
    );
}
