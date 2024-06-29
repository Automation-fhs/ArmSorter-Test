const event = require(`${__dirname}/event.js`);
const fs = require('fs');
const PARAM = require('./params');
//const portNavigate = require(`${__dirname}/PortNavigate.js`);
const partnerData = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const partnerObj = JSON.parse(partnerData);
const arm = require(`${__dirname}/Arm.js`);
const channel = require(`${__dirname}/CAN_msg.js`);
const conveyor = require(`${__dirname}/Conveyor.js`);

//------------Emit Signal to port-------------
event.on("armID", (partnerName, packageId) => {
    const partner = partnerObj.find(el => el.partnerName === partnerName);
    console.log(partner);
    portNavigate(partner.port, packageId);
})

function portNavigate(portId, packageId) {
    console.log(`Waiting for package navigate to port ${portId}`);
    if (arm[portId].pkgTimer.find((el) => el.packageId == packageId)) {
        console.log("Duplicate package error detected!!!");
    }
    else
        pkgMng(arm[portId], packageId);
}

function pkgMng(arm, packageId) {
    if (!arm.waitForSensor) {
        arm.addPkgTimer(setTimeout(() => {
            channel.send(arm.armOpenMsg());
            arm.closeTimer = setTimeout(() => { armClose(arm); }, PARAM.ArmParams.ArmCloseTime);
        }, arm.timeTrvlr), packageId);
    }
    else {
        arm.addPkgTimer(setTimeout(() => { arm.sensorWaiting(); }, arm.timeTrvlr - PARAM.PkgArvTimeout / 2), packageId);
    }
}

function armClose(arm) {
    if (!arm.adjPkgCheck()) {
        channel.send(arm.armCloseMsg());
    }
    else {
        clearTimeout(arm.closeTimer);
        console.log("Waiting for next package(s)...");
    }
}

module.exports = event;