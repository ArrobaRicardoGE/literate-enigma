const { spawn } = require('child_process');

const ls = spawn('py', ['-u', 'x.py']); // -u -> unbuffered

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

ls.stdin.write('13\n'); // pass data
ls.stdin.write('132\n');
//ls.stdin.end();
