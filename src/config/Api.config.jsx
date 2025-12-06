const API_CONFIG = {
    AUTH_URL:
        "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
    PROXY_URL: "/api/appsProxy",
    HEADERS: {
        "Content-Type": "application/json",
    },
    USE_DIRECT: true, // for auth calls
};

const API_CONFIG_FILES = {
    FILES_URL:
        "https://script.google.com/macros/s/AKfycbzXhpMq9Jpn2dtQ57dxjdM9VCQqA7-4a5zc6gxJ8YXEIzGSt_8marYBfibzPs9UA2YD/exec",
    PROXY_URL: "/api/appsProxy",
    HEADERS: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    },
    USE_DIRECT_FILES: true, // toggle direct vs proxy for files endpoints
};

export { API_CONFIG, API_CONFIG_FILES };
export default API_CONFIG;
