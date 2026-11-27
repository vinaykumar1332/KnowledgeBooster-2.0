/**
 * src/constants/index.js
 *
 * App-wide constants: routes, storage keys, pagination, file limits.
 * Import from here instead of repeating magic strings across files.
 */

// ─────────────────────────────────────────────
// CLIENT-SIDE ROUTES
// ─────────────────────────────────────────────
export const ROUTES = {
    LANDING:     "/",
    LOGIN:       "/login",
    SIGNUP:      "/signup",
    HOME:        "/home",
    FILES:       "/files",
    MY_UPLOADS:  "/my-uploads",
    UPLOAD:      "/upload",
    PROFILE:     "/profile",
    VIDEOS:      "/videos",
    DISCOVER:    "/discover",
};

// ─────────────────────────────────────────────
// STORAGE KEYS  (sessionStorage / localStorage)
// ─────────────────────────────────────────────
export const STORAGE_KEYS = {
    /** Current user session: { ok, token, username, email, userType } */
    AUTH:          "auth",
    /** Upload page draft (sessionStorage) */
    UPLOAD_DRAFT:  "uploadDraft",
    /** User theme preference (localStorage) */
    THEME:         "theme",
    /** Sidebar collapsed state (localStorage) */
    SIDEBAR:       "sidebarCollapsed",
};

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────
export const PAGINATION = {
    /** Default page size for file lists */
    FILES_LIMIT:   20,
    /** Number of featured files shown on the home page */
    FEATURED_MAX:  10,
};

// ─────────────────────────────────────────────
// FILE / UPLOAD LIMITS
// ─────────────────────────────────────────────
export const UPLOAD_LIMITS = {
    TITLE_MAX:        100,
    DESCRIPTION_MAX:  300,
    SUBCATEGORY_MAX:  40,
    TAGS_MAX:         200,
};

// ─────────────────────────────────────────────
// AUDIENCE CATEGORIES  (must match Apps Script CATEGORIES)
// ─────────────────────────────────────────────
export const AUDIENCE = {
    STUDENT:      "student",
    PROFESSIONAL: "professional",
    OTHERS:       "others",
};

export const AUDIENCE_VALUES = Object.values(AUDIENCE);

// ─────────────────────────────────────────────
// BROWSER EVENTS (custom)
// ─────────────────────────────────────────────
export const EVENTS = {
    /** Fired after login / logout so components re-read auth state */
    AUTH_CHANGE: "authChange",
};
