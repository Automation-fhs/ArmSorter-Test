const can = require("socketcan");
const channel = can.createRawChannel("can0", true);

channel.start();
channel.send({
    key: 100,
    length: 8,
    data: Buffer.from("12345678")
});

channel.addListener('onMessage', (msg) => { console.log(msg) }); 