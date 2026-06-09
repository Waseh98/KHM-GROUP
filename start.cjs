const fs = require('fs');
const path = require('path');

function getLogFile() {
  const candidates = [
    '/home/u959866192/domains/ktexstore.com/public_html/log.txt',
    path.join(__dirname, 'public_html', 'log.txt'),
    path.join(__dirname, '..', 'public_html', 'log.txt'),
    path.join(__dirname, '..', '..', 'public_html', 'log.txt'),
    path.join(__dirname, 'log.txt')
  ];
  for (const c of candidates) {
    try {
      const dir = path.dirname(c);
      if (fs.existsSync(dir)) return c;
    } catch(e) {}
  }
  return path.join(__dirname, 'log.txt');
}

const logFile = getLogFile();

// Ensure directory exists
try {
  const dir = path.dirname(logFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch (e) {}

// Create a log stream
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function writeLog(type, args) {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.map(a => {
    if (a instanceof Error) return a.stack || a.message;
    return typeof a === 'object' ? JSON.stringify(a) : a;
  }).join(' ');
  const msg = `[${timestamp}] [${type}] ${formattedArgs}\n`;
  logStream.write(msg);
  process.stdout.write(msg);
}

// Redirect console methods
console.log = (...args) => writeLog('INFO', args);
console.error = (...args) => writeLog('ERROR', args);
console.warn = (...args) => writeLog('WARN', args);

console.log('🏁 Application Bootstrapped via start.cjs');

// Run the server
try {
  require('./ktex-backend/server.js');
} catch (err) {
  console.error('💥 Server crashed during bootstrap require:', err);
}

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});
