const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fileUpload = require('express-fileupload');
const { PythonRunner } = require('./runner');
const port = process.env.PORT || 3000;

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
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        runner.write(msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
