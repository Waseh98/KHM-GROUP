const net = require('net');
const fs = require('fs');
const path = require('path');

const FTP_HOST = '31.220.110.252';
const FTP_USER = 'u959866192.Wasay98';
const FTP_PASS = 'Wasay123@#$';
const LOCAL_DIR = 'C:\\Users\\ARSHMAN LAPTOP\\Desktop\\KHM-Group-Final\\dist';
const REMOTE_BASE = '/domains/ktexstore.com/public_html';

let socket = null;
let response = '';
let currentDir = '/';

function sendCmd(cmd) {
    return new Promise((resolve) => {
        response = '';
        socket.once('data', (data) => {
            response = data.toString();
            resolve(response);
        });
        socket.write(cmd + '\r\n');
    });
}

function sendCmdData(cmd) {
    return new Promise((resolve, reject) => {
        const lines = [];
        const dataSocket = net.createConnection(20, FTP_HOST);

        dataSocket.on('connect', () => {
            response = '';
            socket.once('data', (res) => {
                const code = res.toString().substring(0, 3);
                if (code.startsWith('1') || code.startsWith('2')) {
                    dataSocket.once('data', (d) => lines.push(d.toString()));
                    dataSocket.once('close', () => resolve(lines.join('')));
                    dataSocket.once('error', (e) => reject(e));
                } else {
                    dataSocket.end();
                    resolve(res.toString());
                }
            });
            socket.write(cmd + '\r\n');
        });

        dataSocket.on('error', (e) => reject(e));
        setTimeout(() => {
            dataSocket.end();
            resolve('');
        }, 10000);
    });
}

async function ftpLogin() {
    return new Promise((resolve, reject) => {
        socket = net.createConnection(21, FTP_HOST);
        socket.setTimeout(15000);

        socket.on('connect', async () => {
            let res = await sendCmd(`USER ${FTP_USER}`);
            if (res.includes('331')) {
                res = await sendCmd(`PASS ${FTP_PASS}`);
            }
            if (res.includes('230') || res.includes('202')) {
                await sendCmd('TYPE I');
                await sendCmd('OPTS UTF8 ON');
                console.log('Logged in!');
                resolve();
            } else {
                reject(new Error('Login failed: ' + res));
            }
        });

        socket.on('error', (e) => reject(e));
        socket.on('timeout', () => reject(new Error('Connection timeout')));
    });
}

async function ftpMKD(dirPath) {
    const parts = dirPath.split('/').filter(p => p !== '');
    let current = '';
    for (const part of parts) {
        current += '/' + part;
        const res = await sendCmd(`MKD ${current}`);
    }
}

async function ftpCWD(dirPath) {
    await sendCmd(`CWD ${dirPath}`);
    currentDir = dirPath;
}

async function ftpStore(localPath, remotePath) {
    return new Promise((resolve, reject) => {
        const size = fs.statSync(localPath).size;
        let res = '';

        // Use EPSV for passive mode
        socket.once('data', async (data) => {
            res = data.toString();

            if (res.includes('229')) {
                const match = res.match(/\|\|\|(\d+)\|/);
                if (match) {
                    const port = parseInt(match[1]);
                    const dataSocket = net.createConnection(port, FTP_HOST);

                    dataSocket.on('connect', async () => {
                        const fileStream = fs.createReadStream(localPath);
                        fileStream.pipe(dataSocket);

                        fileStream.on('end', () => {
                            dataSocket.end();
                        });

                        dataSocket.on('close', () => {
                            socket.once('data', (final) => {
                                resolve();
                            });
                        });

                        dataSocket.on('error', (e) => reject(e));
                    });

                    dataSocket.on('error', (e) => reject(e));

                    // Send STOR command first
                    socket.write(`STOR ${remotePath}\r\n`);
                }
            } else {
                reject(new Error('EPSV failed: ' + res));
            }
        });

        socket.write('EPSV\r\n');
    });
}

async function uploadFile(filePath, remotePath) {
    try {
        // Navigate to the directory
        const dirPath = path.posix.dirname(remotePath);
        if (dirPath !== '/') {
            await ftpCWD('/');
            const parts = dirPath.split('/').filter(p => p !== '');
            for (const part of parts) {
                await ftpCWD('/' + part);
            }
        }

        // Get file size and send STOR
        const size = fs.statSync(filePath).size;
        let res = await sendCmd(`STOR ${path.posix.basename(remotePath)}`);

        if (res.includes('150') || res.includes('125')) {
            // Need to send file data via data connection
            const match = res.match(/\|\|\|(\d+)\|/);
            if (!match) {
                // Try EPSV again
                res = await sendCmd('EPSV');
            }
            const epsvMatch = res.match(/\|\|\|(\d+)\|/);
            if (epsvMatch) {
                const port = parseInt(epsvMatch[1]);
                const dataSocket = net.createConnection(port, FTP_HOST);

                await new Promise((resolve, reject) => {
                    dataSocket.on('connect', async () => {
                        const fileStream = fs.createReadStream(filePath);
                        fileStream.pipe(dataSocket);
                        fileStream.on('end', () => dataSocket.end());
                        dataSocket.on('close', resolve);
                        dataSocket.on('error', reject);
                    });
                    dataSocket.on('error', reject);
                });
            }
        }

        // Try simple STOR
        const fileData = fs.readFileSync(filePath);
        const simpleRes = await new Promise((resolve) => {
            socket.once('data', (d) => resolve(d.toString()));
            socket.write(`APPE ${path.posix.basename(remotePath)}\r\n`);
            setTimeout(() => resolve(''), 5000);
        });

        return true;
    } catch (e) {
        console.log('[ERR] ' + filePath + ': ' + e.message);
        return false;
    }
}

async function main() {
    try {
        await ftpLogin();

        const files = [];
        const walk = (dir, base) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relPath = path.join(base, entry.name).replace(/\\/g, '/');
                if (entry.isDirectory()) {
                    walk(fullPath, relPath);
                } else {
                    files.push({ fullPath, relPath });
                }
            }
        };
        walk(LOCAL_DIR, '');

        console.log(`Found ${files.length} files to upload`);

        for (const file of files) {
            const remotePath = REMOTE_BASE + file.relPath;
            const dirParts = path.posix.dirname(remotePath).split('/').filter(p => p !== '');

            // Create all directories
            let checkPath = '';
            for (const part of dirParts) {
                checkPath += '/' + part;
                try {
                    await ftpMKD(checkPath);
                } catch (e) { /* dir might exist */ }
            }

            // Navigate to directory
            await ftpCWD('/');
            for (const part of dirParts) {
                await ftpCWD('/' + part);
            }

            // Upload file
            const fileName = path.posix.basename(remotePath);
            const res = await sendCmd(`STOR ${fileName}`);
            console.log('STOR response:', res.substring(0, 100));

            if (res.includes('150') || res.includes('125')) {
                const epsvRes = await sendCmd('EPSV');
                const match = epsvRes.match(/\|\|\|(\d+)\|/);
                if (match) {
                    const port = parseInt(match[1]);
                    const dataSocket = net.createConnection(port, FTP_HOST);

                    await new Promise((res, rej) => {
                        dataSocket.on('connect', () => {
                            const rs = fs.createReadStream(file.fullPath);
                            rs.pipe(dataSocket);
                            rs.on('end', () => dataSocket.end());
                            dataSocket.on('close', res);
                            dataSocket.on('error', rej);
                        });
                        dataSocket.on('error', rej);
                    });
                    console.log('[OK] ' + fileName);
                }
            } else {
                console.log('[SKIP] ' + fileName + ': ' + res.substring(0, 80));
            }
        }

        socket.end();
        console.log('Done!');
    } catch (e) {
        console.error('Error:', e.message);
        if (socket) socket.end();
    }
}

main();
