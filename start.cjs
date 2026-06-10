const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const backendDir = path.join(root, 'ktex-backend');
const distIndex = path.join(root, 'dist', 'index.html');

function run(cmd, cwd = root) {
  console.log(`> ${cmd}`);
  execSync(cmd, {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, NPM_CONFIG_PRODUCTION: 'false' },
  });
}

// 1) Backend deps (Express preset only runs npm install at project root)
if (!fs.existsSync(path.join(backendDir, 'node_modules', 'express'))) {
  console.log('Installing backend dependencies...');
  run('npm install', backendDir);
}

// 2) Frontend build (Vite is a devDependency, skipped in production install)
if (!fs.existsSync(distIndex)) {
  console.log('Installing frontend build tools...');
  run('npm install --include=dev');
  console.log('Building frontend...');
  run('npm run build');
}

require('./ktex-backend/server.js');
