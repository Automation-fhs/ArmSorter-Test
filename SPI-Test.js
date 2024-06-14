var SPI = require('pi-spi');
//var RPIO = require('rpio');
var spi = SPI.initialize("/dev/spidev0.0");
var test = Buffer.from("Sang bede#");
var testRead;

spi.clockSpeed(2e6);
spi.bitOrder(SPI.order.MSB_FIRST);
spi.transfer(test, test.length, function (e, d) {
    if (e) console.error(e);
    else console.log("Got \"" + d.toString() + "\" back.");

    if (test.toString() === d.toString()) {
    } else {
        // NOTE: this will likely happen unless MISO is jumpered to MOSI
        process.exit(-2);
    }
});

// spi.read(1, (err, data) => {
//     if (err) console.error(err);
//     else console.log(data.toString());
// })