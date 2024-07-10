const io = require('socket.io-client');
const serverURL = "http://172.27.1.38:1605";//process.env.SERVERURL;
const socket = io.connect(serverURL);

socket.on("connect", () => {
    console.log("Connected to server");
})

socket.on('disconnect', () => {
    console.log("Disconnected from server");
})

module.exports = socket;