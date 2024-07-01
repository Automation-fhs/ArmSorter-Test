const net = require('net');
const server = net.createServer((socket) => {
    console.log("Client connected");
    socket.on('data', (data) => {
        //console.log(data);
        data_ascii = data.toJSON().data;
        msgStart = "";
        data_ascii.slice(0, 3).map(el => {
            msgStart += String.fromCharCode(el);
        })
        msgEnd = ""
        data_ascii.slice(data_ascii.length - 4, data_ascii.length).map(el => {
            msgEnd += String.fromCharCode(el);
        })
        msgData = ""
        data_ascii.slice(3, data_ascii.length - 4).map(el => {
            msgData += String.fromCharCode(el);
        })
        console.log(msgData);
    })
})

server.listen(3333, () => console.log('listening'))
