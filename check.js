const { execSync } = require('child_process');
const fs = require('fs');
try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
    fs.writeFileSync('compile_errors.txt', "SUCCESS\n" + output);
} catch (e) {
    fs.writeFileSync('compile_errors.txt', "FAILURE\n" + e.stdout + "\n" + e.stderr);
}
