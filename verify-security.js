#!/usr/bin/env node

/**
 * Security Verification Script
 * Run this to verify all security fixes are in place
 * 
 * Usage: node verify-security.js
 */

const fs = require('fs');
const path = require('path');

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0,
};

const log = {
    success: (msg) => console.log(`${msg}`),
    error: (msg) => console.log(` ${msg}`),
    warning: (msg) => console.log(` ${msg}`),
    info: (msg) => console.log(`ℹ${msg}`),
};

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

console.log(`\n${colors.blue}${'='.repeat(60)}`);
console.log('🔒 Security Verification Checklist');
console.log(`${'='.repeat(60)}${colors.reset}\n`);

// Check 1: Security utility file exists
console.log('📁 Checking security files...');
const securityFile = path.join(__dirname, 'src/utils/security.js');
if (fs.existsSync(securityFile)) {
    log.success('Security utility file exists');
    checks.passed++;
} else {
    log.error('Security utility file missing');
    checks.failed++;
}

// Check 2: Console logs removed from auth files
console.log('\n📝 Checking console logs in auth files...');
const authFiles = [
    'src/pages/auth/Login.jsx',
    'src/pages/auth/Signup.jsx',
    'src/components/navbar/Navigation.jsx',
];

authFiles.forEach((file) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        log.warning(`File not found: ${file}`);
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const hasConsoleLog = /console\.(log|debug|info)\(/g.test(content);
    
    if (!hasConsoleLog) {
        log.success(`No console.log in ${file}`);
        checks.passed++;
    } else {
        log.error(`Found console.log in ${file}`);
        checks.failed++;
    }
});

// Check 3: Error message sanitization
console.log('\n🛡️  Checking error message handling...');
const loginContent = fs.readFileSync(path.join(__dirname, 'src/pages/auth/Login.jsx'), 'utf8');
const signupContent = fs.readFileSync(path.join(__dirname, 'src/pages/auth/Signup.jsx'), 'utf8');

const hasGenericErrorLogin = loginContent.includes('showToast("Invalid credentials")');
const hasGenericErrorSignup = signupContent.includes('Unable to create account');

if (hasGenericErrorLogin && hasGenericErrorSignup) {
    log.success('Generic error messages implemented');
    checks.passed++;
} else {
    log.warning('Check error message implementation');
    checks.warnings++;
}

// Check 4: Input validation
console.log('\n✔️  Checking input validation...');
if (loginContent.includes('validateEmail') && signupContent.includes('validateEmail')) {
    log.success('Email validation implemented');
    checks.passed++;
} else {
    log.error('Email validation missing');
    checks.failed++;
}

if (signupContent.includes('sanitizeInput')) {
    log.success('Input sanitization implemented');
    checks.passed++;
} else {
    log.error('Input sanitization missing');
    checks.failed++;
}

// Check 5: Security configuration files
console.log('\n⚙️  Checking configuration files...');
const securityConfigFile = path.join(__dirname, 'src/config/security.config.js');
const securityChecklistFile = path.join(__dirname, 'src/config/securityChecklist.js');

if (fs.existsSync(securityConfigFile)) {
    log.success('Security config file exists');
    checks.passed++;
} else {
    log.error('Security config file missing');
    checks.failed++;
}

if (fs.existsSync(securityChecklistFile)) {
    log.success('Security checklist file exists');
    checks.passed++;
} else {
    log.error('Security checklist file missing');
    checks.failed++;
}

// Check 6: Documentation
console.log('\n📚 Checking documentation...');
const securityAuditFile = path.join(__dirname, 'SECURITY_AUDIT.md');
const securityFixesFile = path.join(__dirname, 'SECURITY_FIXES.md');

if (fs.existsSync(securityAuditFile)) {
    log.success('Security audit documentation exists');
    checks.passed++;
} else {
    log.error('Security audit documentation missing');
    checks.failed++;
}

if (fs.existsSync(securityFixesFile)) {
    log.success('Security fixes documentation exists');
    checks.passed++;
} else {
    log.error('Security fixes documentation missing');
    checks.failed++;
}

// Summary
console.log(`\n${colors.blue}${'='.repeat(60)}`);
console.log('📊 Summary');
console.log(`${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.green}✅ Passed: ${checks.passed}${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${checks.failed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${checks.warnings}${colors.reset}`);

const totalChecks = checks.passed + checks.failed + checks.warnings;
const passPercentage = ((checks.passed / totalChecks) * 100).toFixed(1);

console.log(`\n📈 Overall: ${colors.green}${passPercentage}% Secure${colors.reset}\n`);

if (checks.failed === 0 && checks.warnings === 0) {
    console.log(`${colors.green}🎉 All security checks passed!${colors.reset}\n`);
    process.exit(0);
} else if (checks.failed > 0) {
    console.log(`${colors.red}⚠️  Fix the failed checks above.${colors.reset}\n`);
    process.exit(1);
} else {
    console.log(`${colors.yellow}📋 Review warnings above.${colors.reset}\n`);
    process.exit(0);
}
