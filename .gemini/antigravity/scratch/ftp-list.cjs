const net = require('net');

const FTP_HOST = '31.220.110.252';
const FTP_USER = 'u959866192.Wasay98';
const FTP_PASS = 'Wasay123@#$';

let socket = null;
let response = '';

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

async function ftpLogin() {
    return new Promise((resolve, reject) => {
        socket = net.createConnection(21, FTP_HOST);
        socket.setTimeout(15000);

        socket.once('data', async (greeting) => {
            console.log('Greeting:', greeting.toString().trim());
            let res = await sendCmd(`USER ${FTP_USER}`);
            console.log('USER response:', res.trim());
            if (res.includes('331')) {
                res = await sendCmd(`PASS ${FTP_PASS}`);
                console.log('PASS response:', res.trim());
            }
            if (res.includes('230') || res.includes('202')) {
                await sendCmd('TYPE A');
                await sendCmd('OPTS UTF8 ON');
                console.log('Logged in successfully!');
                resolve();
            } else {
                reject(new Error('Login failed: ' + res));
            }
        });

        socket.on('error', (e) => reject(e));
        socket.on('timeout', () => reject(new Error('Connection timeout')));
    });
}

async function listDir(dirPath) {
    try {
        await sendCmd(`CWD ${dirPath}`);
        const epsvRes = await sendCmd('EPSV');
        console.log('EPSV Response:', epsvRes.trim());
        const match = epsvRes.match(/\|\|\|(\d+)\|/);
        if (!match) {
            throw new Error('EPSV failed: ' + epsvRes);
        }
        const port = parseInt(match[1]);
        const dataSocket = net.createConnection(port, FTP_HOST);

        const dataPromise = new Promise((resolve, reject) => {
            let buffer = '';
            dataSocket.on('data', (d) => buffer += d.toString());
            dataSocket.on('close', () => resolve(buffer));
            dataSocket.on('error', reject);
        });

        const listRes = await sendCmd('LIST');
        console.log('LIST Response:', listRes.trim());
        const data = await dataPromise;
        console.log('--- File List for ' + dirPath + ' ---');
        console.log(data);
        console.log('-----------------------------');
    } catch (e) {
        console.error('List dir failed for', dirPath, e.message);
    }
}

async function main() {
    try {
        await ftpLogin();
        await listDir('/');
        await listDir('/domains');
        await listDir('/domains/ktexstore.com');
        await listDir('/domains/ktexstore.com/public_html');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        if (socket) socket.end();
    }
}

main();
