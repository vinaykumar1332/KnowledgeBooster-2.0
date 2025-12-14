const API_CONFIG = {
    AUTH_URL:
        "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
    PROXY_URL: "/api/appsProxy",
    HEADERS: {
        "Content-Type": "application/json",
    },
    USE_DIRECT: false,
};

const API_CONFIG_FILES = {
    FILES_URL:
        "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec",
    PROXY_URL: "/api/FilesProxy",
    HEADERS: {
        "Content-Type": "application/json",
    },
    USE_DIRECT_FILES: false,
};

export { API_CONFIG, API_CONFIG_FILES };
export default API_CONFIG;
