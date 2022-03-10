const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        ls.stdin.write(`${msg}\n`);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const { spawn } = require('child_process');
const ls = spawn('py', ['-u', 'x.py']); // -u -> unbuffered

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    io.emit('chat message', ab2str(data));
});

ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    io.emit('chat message', data);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
    io.emit('chat message', data);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    io.emit('chat message', code);
});

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
