const net = require('net');
const server = net.createServer((socket) => {
    console.log("Client connected");
    socket.on('data', (data) => {
        console.log(data);
    })
})

server.listen(3333, () => console.log('listening'))
