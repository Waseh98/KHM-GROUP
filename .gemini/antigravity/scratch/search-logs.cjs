const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\ARSHMAN LAPTOP\\.gemini\\antigravity\\brain\\bbb52f9d-5126-4800-bb4e-933180effa5e\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
    console.error('Log file not found:', logPath);
    process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
console.log('Total lines:', lines.length);

lines.forEach((line, index) => {
    if (line.toLowerCase().includes('odr') || line.toLowerCase().includes('order') || line.toLowerCase().includes('remove') || line.toLowerCase().includes('kha')) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.source === 'USER_EXPLICIT' || parsed.type === 'PLANNER_RESPONSE' || parsed.type === 'USER_INPUT') {
                console.log(`Step ${parsed.step_index} (${parsed.source} / ${parsed.type}):`);
                console.log(parsed.content);
                console.log('-------------------------------------------');
            }
        } catch (e) {
            // not valid json line or other error
        }
    }
});
