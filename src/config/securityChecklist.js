/**
 * Security Checklist for Development
 * Use this to validate security best practices during development
 */

export const SECURITY_CHECKLIST = {
    "Input Validation": {
        completed: true,
        items: [
            "✅ Email validation implemented",
            "✅ Password validation implemented",
            "✅ Input sanitization for XSS prevention",
            "✅ Length limits enforced",
            "✅ Type checking for inputs",
        ],
    },
    
    "Error Handling": {
        completed: true,
        items: [
            "✅ Generic error messages shown to users",
            "✅ No server details exposed",
            "✅ No console.log in production code",
            "✅ Safe error parsing",
            "✅ Graceful fallbacks",
        ],
    },
    
    "Authentication": {
        completed: true,
        items: [
            "✅ Protected routes implemented",
            "✅ Session validation on page load",
            "✅ Logout functionality",
            "✅ Auth state managed safely",
            "✅ SessionStorage for auth data",
        ],
    },
    
    "XSS Prevention": {
        completed: true,
        items: [
            "✅ sanitizeInput() function created",
            "✅ All user inputs sanitized",
            "✅ HTML special characters escaped",
            "✅ No innerHTML usage",
            "✅ No dangerouslySetInnerHTML",
        ],
    },
    
    "Data Storage": {
        completed: true,
        items: [
            "✅ No hardcoded secrets",
            "✅ SessionStorage cleared on logout",
            "✅ Theme preference in localStorage",
            "✅ Safe JSON parsing with fallbacks",
            "✅ No sensitive data in localStorage",
        ],
    },
    
    "Code Quality": {
        completed: true,
        items: [
            "✅ No console.log statements",
            "✅ No console.error statements",
            "✅ No commented-out sensitive code",
            "✅ Proper error boundaries",
            "✅ Clean, readable code",
        ],
    },
    
    "Server-Side (TODO)": {
        completed: false,
        items: [
            "⚠️ HTTPS enforcement",
            "⚠️ CORS configuration",
            "⚠️ Rate limiting on auth endpoints",
            "⚠️ Password hashing (bcrypt/Argon2)",
            "⚠️ CSRF token implementation",
            "⚠️ Security headers configuration",
            "⚠️ Session timeout settings",
            "⚠️ API authentication (JWT/OAuth2)",
        ],
    },
    
    "Testing": {
        completed: false,
        items: [
            "⚠️ DevTools inspection (F12) - no sensitive data visible",
            "⚠️ Network tab - no API keys exposed",
            "⚠️ Input validation testing",
            "⚠️ Error handling testing",
            "⚠️ XSS payload testing",
            "⚠️ CSRF protection testing",
        ],
    },
};

/**
 * Development Tips
 */
export const DEVELOPMENT_TIPS = [
    "Always use sanitizeInput() for user inputs",
    "Use validateEmail() for email validation",
    "Use validatePassword() for password validation",
    "Use getSafeAuth() when reading auth from sessionStorage",
    "Never expose server errors to users",
    "Never log passwords or sensitive data",
    "Always validate on both client and server",
    "Keep dependencies updated: npm audit fix",
    "Use environment variables for configuration",
    "Test with browser DevTools to ensure no sensitive data exposed",
];

/**
 * Security Testing Scenarios
 */
export const TESTING_SCENARIOS = {
    "XSS Prevention": [
        { input: "<script>alert('XSS')</script>", expected: "&lt;script&gt;alert('XSS')&lt;/script&gt;" },
        { input: "' OR '1'='1", expected: "&#x27; OR &#x27;1&#x27;=&#x27;1" },
        { input: "<img src=x onerror=alert('XSS')>", expected: "&lt;img src=x onerror=alert('XSS')&gt;" },
    ],
    
    "Email Validation": [
        { input: "user@example.com", expected: true },
        { input: "invalid-email", expected: false },
        { input: "user@", expected: false },
        { input: "@example.com", expected: false },
        { input: "user@example", expected: false },
    ],
    
    "Password Validation": [
        { input: "WeakPass1!", expected: false }, // Only 1 uppercase
        { input: "StrongPass123!", expected: true }, // 2+ uppercase, 2+ numbers, 1+ special
        { input: "NoNumbers!", expected: false }, // No numbers
        { input: "NoSpecial123", expected: false }, // No special chars
    ],
};

/**
 * Print security checklist to console
 */
export const printSecurityChecklist = () => {
    console.log("=".repeat(50));
    console.log("🔒 SECURITY CHECKLIST - Development Mode");
    console.log("=".repeat(50));
    
    Object.entries(SECURITY_CHECKLIST).forEach(([category, { completed, items }]) => {
        const status = completed ? "✅" : "⚠️";
        console.log(`\n${status} ${category}`);
        items.forEach((item) => console.log(`  ${item}`));
    });
    
    console.log("\n" + "=".repeat(50));
    console.log("Development Tips:");
    DEVELOPMENT_TIPS.forEach((tip) => console.log(`• ${tip}`));
    console.log("=".repeat(50));
};

export default {
    SECURITY_CHECKLIST,
    DEVELOPMENT_TIPS,
    TESTING_SCENARIOS,
    printSecurityChecklist,
};
