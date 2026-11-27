/**
 * src/utils/sanitize.js
 *
 * UI-side input sanitization and validation helpers.
 * These run before data leaves the browser — the server validates again.
 * Never trust client-side sanitization alone.
 */

/** Collapse multiple spaces, trim edges. */
export function trimmed(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
}

/** Cap a string at max characters after trimming. */
export function cap(value, max) {
    return trimmed(value).slice(0, max);
}

/** Basic email format check (server re-validates). */
export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed(value));
}

/** Minimum password length. */
export function isValidPassword(value) {
    return typeof value === "string" && value.length >= 6;
}

/** Sanitize a display name: strip control characters, cap length. */
export function sanitizeName(value, max = 80) {
    return cap(value.replace(/[\x00-\x1F\x7F]/g, ""), max);
}

/**
 * Reject strings that would be treated as spreadsheet formulas
 * (values starting with = + - @).
 * The server also protects against this, but catching it early gives
 * the user a helpful message immediately.
 */
export function isFormulaInjection(value) {
    return /^[=+\-@]/.test(trimmed(value));
}

/** Validate that a URL starts with https:// and has a hostname. */
export function isHttpsUrl(value) {
    try {
        const u = new URL(trimmed(value));
        return u.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Validate a Google Drive file link.
 * Returns { valid: boolean, reason?: string }
 */
export function validateDriveUrl(value) {
    const url = trimmed(value);
    if (!url) return { valid: false, reason: "empty" };
    if (!isHttpsUrl(url)) return { valid: false, reason: "not_https" };
    if (!url.includes("drive.google.com")) return { valid: false, reason: "not_drive" };
    if (url.includes("/folders/")) return { valid: false, reason: "folder" };
    const hasId = /\/d\/[a-zA-Z0-9_-]+/.test(url) || /[?&]id=[a-zA-Z0-9_-]+/.test(url);
    if (!hasId) return { valid: false, reason: "no_file_id" };
    return { valid: true };
}

/**
 * Sanitize an upload payload before sending to the server.
 * Returns a new object — does not mutate the input.
 */
export function sanitizeUploadPayload(payload) {
    return {
        username:     sanitizeName(payload.username ?? "", 80),
        email:        trimmed(payload.email ?? "").toLowerCase().slice(0, 120),
        category:     trimmed(payload.category ?? "").toLowerCase().slice(0, 20),
        subcategory:  cap(payload.subcategory ?? "", 40),
        title:        cap(payload.title ?? "", 100),
        description:  cap(payload.description ?? "", 300),
        driveUrl:     trimmed(payload.driveUrl ?? "").slice(0, 500),
        fileId:       trimmed(payload.fileId ?? "").slice(0, 60),
        thumbnailUrl: trimmed(payload.thumbnailUrl ?? "").slice(0, 500),
    };
}
