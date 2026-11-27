#!/usr/bin/env node

/**
 * KnowledgeHub Setup Verification Script
 * Checks if both backend and frontend are running correctly
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';

console.log('\n' + '='.repeat(60));
console.log('🔍 KnowledgeHub Setup Verification');
console.log('='.repeat(60) + '\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(status, message) {
  const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  const color = status === 'success' ? colors.green : status === 'error' ? colors.red : colors.yellow;
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

function checkBackend() {
  return new Promise((resolve) => {
    console.log(`\n${colors.blue}Checking Backend Server...${colors.reset}`);

    const req = http.get(`${BACKEND_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'healthy' || json.ok) {
            log('success', `Backend is running on ${BACKEND_URL}`);
            log('success', `Health status: ${json.message || 'healthy'}`);
            resolve(true);
          } else {
            log('error', 'Backend responded but health check failed');
            resolve(false);
          }
        } catch (err) {
          log('error', `Backend response parse error: ${err.message}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      log('error', `Backend not responding: ${err.message}`);
      log('error', `Make sure backend is running: node server/server-simple.js`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      log('error', 'Backend timeout');
      resolve(false);
    });

    req.setTimeout(5000);
  });
}

function checkFrontend() {
  return new Promise((resolve) => {
    console.log(`\n${colors.blue}Checking Frontend Server...${colors.reset}`);

    const req = http.get(FRONTEND_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('success', `Frontend is running on ${FRONTEND_URL}`);
          log('success', `HTTP Status: ${res.statusCode}`);
          resolve(true);
        } else {
          log('error', `Frontend returned status ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      log('error', `Frontend not responding: ${err.message}`);
      log('error', `Make sure frontend is running: npm run dev`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      log('error', 'Frontend timeout');
      resolve(false);
    });

    req.setTimeout(5000);
  });
}

function checkDependencies() {
  return new Promise((resolve) => {
    console.log(`\n${colors.blue}Checking Dependencies...${colors.reset}`);

    const fs = require('fs');
    const path = require('path');

    // Check if node_modules exist
    const frontendModules = fs.existsSync(path.join(__dirname, 'node_modules'));
    const backendModules = fs.existsSync(path.join(__dirname, 'server', 'node_modules'));

    if (frontendModules) {
      log('success', 'Frontend dependencies installed');
    } else {
      log('error', 'Frontend dependencies missing - run: npm install');
    }

    if (backendModules) {
      log('success', 'Backend dependencies installed');
    } else {
      log('error', 'Backend dependencies missing - run: cd server && npm install');
    }

    resolve(frontendModules && backendModules);
  });
}

function checkEnvFiles() {
  return new Promise((resolve) => {
    console.log(`\n${colors.blue}Checking Configuration Files...${colors.reset}`);

    const fs = require('fs');
    const path = require('path');

    const envFile = path.join(__dirname, 'server', '.env');

    if (fs.existsSync(envFile)) {
      log('success', 'Backend .env file exists');
      resolve(true);
    } else {
      log('error', 'Backend .env file missing');
      log('error', 'Run: cp server/.env.example server/.env');
      resolve(false);
    }
  });
}

async function runAllChecks() {
  const checks = [
    { name: 'Dependencies', fn: checkDependencies },
    { name: 'Config Files', fn: checkEnvFiles },
    { name: 'Backend Server', fn: checkBackend },
    { name: 'Frontend Server', fn: checkFrontend },
  ];

  const results = {};

  for (const check of checks) {
    results[check.name] = await check.fn();
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Verification Summary');
  console.log('='.repeat(60));

  let allPass = true;
  for (const [name, passed] of Object.entries(results)) {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) allPass = false;
  }

  console.log('='.repeat(60) + '\n');

  if (allPass) {
    console.log(colors.green + '🎉 All systems operational!' + colors.reset);
    console.log('\n✨ Your KnowledgeHub is ready to use!');
    console.log(`\n📱 Frontend: ${FRONTEND_URL}/login`);
    console.log(`⚙️  Backend:  ${BACKEND_URL}/api/health\n`);
  } else {
    console.log(colors.red + '⚠️  Some checks failed. See above for details.' + colors.reset);
    console.log('\n📖 Quick fix:');
    console.log('1. npm install');
    console.log('2. cd server && npm install && cp .env.example .env');
    console.log('3. npm run dev:full\n');
  }

  console.log('='.repeat(60) + '\n');

  return allPass ? 0 : 1;
}

// Run verification
runAllChecks().then(exitCode => {
  process.exit(exitCode);
}).catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
