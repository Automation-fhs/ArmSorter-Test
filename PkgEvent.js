const event = require(`${__dirname}/event.js`);
const fs = require('fs');
//const portNavigate = require(`${__dirname}/PortNavigate.js`);
const partnerData = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const partnerObj = JSON.parse(partnerData);
const arm = require(`${__dirname}/Arm.js`);
const channel = require(`${__dirname}/CAN_msg.js`);
const conveyor = require(`${__dirname}/Conveyor.js`);

//------------Emit Signal to port-------------
event.on("armID", (partnerName) => {
    const partner = partnerObj.find(el => el.partnerName === partnerName);
    console.log(partner);
    portNavigate(partner.port);
})

function portNavigate(portId) {
    console.log(`Waiting for package navigate to port ${portId}`);
    pkgMng(arm[portId]);
}

function pkgMng(arm) {
    arm.addPkgTimer = setTimeout(() => { armOpen(arm); }, arm.timeTrvlr);
}

function armOpen(arm) {
    channel.send(arm.armOpenMsg());
    arm.closeTimer = setTimeout(() => { armClose(arm); }, 1500);
}

function armClose(arm) {
    channel.send(arm.armCloseMsg());
}

module.exports = event;