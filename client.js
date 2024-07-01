const io = require('socket.io-client');
const serverURL = "http://172.27.1.38:1605"
const socket = io.connect(serverURL);

socket.on("connect", () => {
    console.log("Connected to server");
})

socket.on('disconnect', () => {
    console.log("Disconnected from server");
})

socket.on('port', (msg) => {
    console.log(msg);
})

socket.emit('package', 1);