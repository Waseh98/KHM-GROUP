const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
}

require('./ktex-backend/server.js');
