const { spawn } = require('child_process');
const { timingSafeEqual } = require('crypto');
const { ab2str } = require('./util');

class Runner {
    constructor(io) {
        this.io = io;
    }
    run(filename) {
        let args = this.args;
        args.push(filename);
        this.process = spawn(this.command, args);
        this.process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            this.io.emit('to_client', ab2str(data));
        });
        this.process.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
    }

    write(data) {
        this.process.stdin.write(`${data}\n`);
    }

    kill() {
        this.process.kill('SIGINT');
    }
}

class PythonRunner extends Runner {
    constructor(io) {
        super(io);
        this.command = 'py';
        this.args = ['-u'];
    }
    static command = 'py';
    static args = ['-u'];
}

module.exports = { PythonRunner };
