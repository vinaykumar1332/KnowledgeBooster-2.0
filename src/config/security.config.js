/**
 * Security Headers Configuration
 * These headers should be configured on the server/API
 * This file documents the recommended security headers
 */

export const SECURITY_HEADERS = {
    // Prevent clickjacking attacks
    "X-Frame-Options": "DENY",
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Enable XSS protection in older browsers
    "X-XSS-Protection": "1; mode=block",
    
    // Enforce HTTPS
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    
    // Control referrer information
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Content Security Policy - Very restrictive by default
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Vite/React needs this for HMR in dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://apis.google.com https://drive.google.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; "),
    
    // Disable feature delegation
    "Permissions-Policy": [
        "geolocation=()",
        "microphone=()",
        "camera=()",
        "payment=()",
        "usb=()",
        "magnetometer=()",
        "gyroscope=()",
        "accelerometer=()",
    ].join(", "),
};

/**
 * Recommended server-side security configurations
 * Add these to your API/backend configuration
 */
export const SERVER_SECURITY_CHECKLIST = {
    "HTTPS Only": "All endpoints must use HTTPS in production",
    "CORS Whitelist": "Only allow requests from known origins",
    "Rate Limiting": "Implement rate limiting for auth endpoints",
    "Password Hashing": "Use bcrypt, scrypt, or Argon2 for password hashing",
    "Input Validation": "Validate and sanitize all inputs server-side",
    "Output Encoding": "Properly encode all outputs to prevent XSS",
    "CSRF Protection": "Use CSRF tokens for state-changing requests",
    "Security Headers": "Implement all security headers listed above",
    "Dependency Audit": "Regularly audit npm dependencies with npm audit",
    "Secrets Management": "Never store secrets in code, use environment variables",
    "Error Handling": "Don't expose sensitive details in error messages",
    "Logging": "Log security events but don't log sensitive data",
    "API Key Rotation": "Regularly rotate API keys and credentials",
    "Session Management": "Implement secure session handling with HttpOnly cookies",
};

/**
 * Environment-specific security configurations
 */
export const SECURITY_CONFIG = {
    development: {
        enableLogging: false, // Disable in production
        enableDevTools: true,
        corsOrigins: ["http://localhost:3000", "http://localhost:5173"],
    },
    production: {
        enableLogging: false, // Always disabled
        enableDevTools: false, // Disable browser dev tools suggestions
        corsOrigins: [
            "https://knowledge-booster-2-0.vercel.app",
            "https://yourdomain.com",
        ],
    },
};

export default SECURITY_HEADERS;
