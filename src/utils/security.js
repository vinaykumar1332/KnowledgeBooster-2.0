/**
 * Security utility functions for input validation and sanitization
 * Prevents XSS, injection attacks, and other security vulnerabilities
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
};

/**
 * Sanitize string input to prevent XSS
 * Remove dangerous characters and scripts
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
    if (typeof input !== "string") return "";
    
    return String(input)
        .trim()
        .replace(/[<>\"']/g, (char) => {
            const escapeMap = {
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#x27;",
            };
            return escapeMap[char];
        });
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }
    if ((password.match(/[A-Z]/g) || []).length < 2) {
        errors.push("Password must contain at least 2 uppercase letters");
    }
    if ((password.match(/\d/g) || []).length < 2) {
        errors.push("Password must contain at least 2 numbers");
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Password must contain at least 1 special character (!@#$%^&*)");
    }
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Safely parse JSON from storage
 * @param {string} jsonString
 * @param {any} fallback
 * @returns {any}
 */
export const safeJsonParse = (jsonString, fallback = null) => {
    try {
        if (typeof jsonString !== "string" || !jsonString.trim()) {
            return fallback;
        }
        const parsed = JSON.parse(jsonString);
        return parsed || fallback;
    } catch (err) {
        // Silently fail to prevent exposing parse errors
        return fallback;
    }
};

/**
 * Get safe auth data from sessionStorage
 * @returns {object|null}
 */
export const getSafeAuth = () => {
    try {
        const authString = sessionStorage.getItem("auth");
        const auth = safeJsonParse(authString, null);
        
        // Validate auth structure
        if (auth && typeof auth === "object" && auth.ok === true) {
            return {
                ok: auth.ok,
                username: sanitizeInput(auth.username || ""),
                email: sanitizeInput(auth.email || ""),
                userId: sanitizeInput(auth.userId || ""),
            };
        }
        return null;
    } catch (err) {
        return null;
    }
};

/**
 * Remove sensitive data from error objects before logging
 * @param {Error} error
 * @returns {object}
 */
export const sanitizeError = (error) => {
    if (!error || typeof error !== "object") {
        return { message: "An error occurred" };
    }
    
    // Only expose safe error messages
    const safeMessage = String(error.message || "An error occurred")
        .substring(0, 100)
        .replace(/[<>]/g, "");
    
    return {
        message: safeMessage,
        type: error.name || "Error",
    };
};

/**
 * Validate URL to prevent open redirect vulnerabilities
 * @param {string} url
 * @param {string[]} allowedOrigins
 * @returns {boolean}
 */
export const isValidRedirectUrl = (url, allowedOrigins = []) => {
    try {
        if (!url || typeof url !== "string") return false;
        
        // Allow relative paths
        if (url.startsWith("/")) return true;
        
        // Check absolute URLs against whitelist
        const urlObj = new URL(url, window.location.origin);
        return allowedOrigins.includes(urlObj.origin);
    } catch (err) {
        return false;
    }
};

/**
 * Generate Content Security Policy compliant attributes
 * @returns {object}
 */
export const getCSPAttributes = () => {
    return {
        crossOrigin: "anonymous",
        referrerPolicy: "no-referrer",
    };
};

export default {
    validateEmail,
    sanitizeInput,
    validatePassword,
    safeJsonParse,
    getSafeAuth,
    sanitizeError,
    isValidRedirectUrl,
    getCSPAttributes,
};
