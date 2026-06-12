const https = require('https');

function testUrl(url) {
    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Cache-Control': 'no-cache'
            }
        };
        https.get(url, options, (res) => {
            console.log(`URL: ${url}`);
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Headers:', res.headers);
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`Body Length: ${body.length}`);
                console.log(`Body Snippet: ${body.substring(0, 200)}`);
                console.log('-------------------------------------------');
                resolve();
            });
        }).on('error', (err) => {
            console.log(`URL: ${url}`);
            console.log(`Error: ${err.message}`);
            console.log('-------------------------------------------');
            resolve();
        });
    });
}

async function main() {
    await testUrl('https://ktexstore.com/?cb=' + Date.now());
    await testUrl('https://ktexstore.com/admin/login?cb=' + Date.now());
    await testUrl('https://ktexstore.com/api/health?cb=' + Date.now());
    await testUrl('https://ktexstore.com/log.txt?cb=' + Date.now());
}

main();
