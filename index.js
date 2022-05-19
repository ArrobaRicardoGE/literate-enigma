const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fileUpload = require('express-fileupload');
const { PythonRunner } = require('./runner');
const port = process.env.PORT || 3000;
const fs = require('fs');

app.use(fileUpload());
app.use('/static', express.static(__dirname + '/static'));

const runner = new PythonRunner(io);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/pong', (req, res) => {
    res.sendFile(__dirname + '/pong.html');
});

app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/temp/' + sampleFile.name; // use join

    // Use the mv() method to place the file somewhere on your server
    console.log(uploadPath);
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        runner.run(uploadPath);
        res.redirect('/');
    });
});

io.on('connection', (socket) => {
    socket.on('state', (msg) => {
        console.log(msg);
        if (msg == 'start') runner.run('temp/test.py');
        if (msg == 'stop') runner.kill();
    });
    socket.on('to_server', (msg) => {
        runner.write(msg);
    });
    socket.on('upload', (msg) => {
        msg = `import json

class PongGameInterface:
    def __init__(self):
        self.state = {
            'ball_pos': [0, 0],
            'my_pos': 0,
            'mov': 0
        }

    def _request_update(self):
        self.state = json.loads(input())

    def _send_update(self):
        print(json.dumps(self.state))

    def get_my_position(self):
        return self.state['my_pos']

    def get_ball_position(self):
        return self.state['ball_pos']

    def set_movement(self, dir):
        if dir != 0 and dir != 1 and dir != 2:
            raise Exception()
        self.state['mov'] = dir
        
${msg}
    def __init__(self):
        self.api = PongGameInterface()

if __name__ == '__main__':
    gm = Pong()
    while True:
        gm.api._request_update()
        gm.strategy()
        gm.api._send_update()
    `;
        fs.writeFile('temp/test.py', msg, (err) => {
            if (err) {
                socket.emit('ack', 'error' + err.message);
                return;
            }
            socket.emit('ack', 'good');
        });
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
