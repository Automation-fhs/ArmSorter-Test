const can = require("socketcan");
const channel = can.createRawChannel("can0", true);
const PARAM = require(`${__dirname}/params.js`)
const arm = require(`${__dirname}/Arm.js`);
//const { msg_Hndler } = require(`${__dirname}/CAN_msg_hndler.js`);

channel.start();
channel.send({
    id: 0x0011,
    length: 8,
    data: Buffer.from([0x00, 0x00, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00])
});

channel.addListener('onMessage', (msg) => { msg_Hndler(msg); });

const msg_Hndler = (msg) => {
    if (msg.id == PARAM.Id.Center) { //Check if receiver is Center
        switch (msg.data.toJSON().data[2]) {
            case PARAM.MsgCode.Error:
                err_Hndler();
                break;
            case PARAM.MsgCode.cmdConf:
                confirm_Hndler(msg.data.toJSON().data[1]);
                break;
            case PARAM.MsgCode.ArmRes:
                armRes_Hndler();
                break;
            case PARAM.MsgCode.ArmSensor:
                armSensor_Hndler(arm[msg.data.toJSON().data[1]]);
                break;
            default:
        }
    }
}

function err_Hndler() {
    //not yet implemented
    //Write log + Warn err?
}

function confirm_Hndler(armId) {
    arm[armId].cnfHndl();
}

function armRes_Hndler() {
    //not yet implemented
    //Confirm params change or get params from arm[armID]
}

function armSensor_Hndler(arm) {
    if (arm.waitForSensor && arm.pkgArriving) {
        channel.send(arm.armOpenMsg());
        arm.pkgArriving = false;
        clearTimeout(arm.pkgArrvTimeout);
        arm.closeTimer = setTimeout(() => { armClose(arm); }, PARAM.ArmParams.ArmCloseTime);
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


module.exports = channel;