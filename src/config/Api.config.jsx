// Central API config for both local and production (Vercel)
// Always use these relative endpoints; serverless functions handle forwarding
export const API_CONFIG = {
    AUTH_URL: "/api/auth",
    HEADERS: { "Content-Type": "application/json" },
};

export const API_CONFIG_FILES = {
    FILES_URL: "/api/files",
    HEADERS: { "Content-Type": "application/json" },
};
