

export const ENDPOINTS = {
    AUTH: {
        ROOT: "/auth",
        LOGIN: "/auth/login",        /** POST – explicit signup (Vercel serverless) */
        SIGNUP: "/auth/signup",
    },

    FILES: {
        LIST: "/files",
        SEARCH: "/files/search",
        UPLOAD: "/files/upload",
    },

    YOUTUBE: {
        SEARCH: "/youtube/search",
    },

    HOME: "/home",
    TAXONOMY: "/taxonomy",
    HEALTH: "/health",
};

export default ENDPOINTS;
