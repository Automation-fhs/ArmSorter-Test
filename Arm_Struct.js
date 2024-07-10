const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const dataObj = JSON.parse(data);
const deliPartner = dataObj.map(el => { return el.partnerName });
const logger = require(`${__dirname}/log/logger.js`);
const { exec } = require('child_process');
const { Console } = require('console');
//const channel = require(`${__dirname}/CAN_msg.js`);
const PARAM = require(`${__dirname}/params.js`);
const PkgTimerObj = require(`${__dirname}/pkgTimerObj.js`);
const socket = require(`${__dirname}/socket.js`);
//const conveyor = require(`${__dirname}/Conveyor.js`)

let availableMotorVoltage = [5, 9, 12, 24, 36, 48, 96, 110, 220];
let limitDistance = [0, 20];

class Arm {
    #port;
    #canId;
    #port_Distance;
    #deli_ptnr;
    #motor_V;
    #motor_Enc_Res;
    consPkg;
    /*Flag indicate only-timer or timer-sensor mode 
    waiForSensor = true : timer-sensor mode */
    waitForSensor;
    // Flag indicate that package has come near to Arm, wait for sensor signal to open Arm
    pkgArriving;
    // Timer for waiting sensor signal. Clear when received sensor signal. Timeout will log error
    pkgArrvTimeout;
    constructor(position, delivery_partner) {
        this.#port = position;
        this.#canId = 0x0100 + this.#port;
        this.#deli_ptnr = delivery_partner;
        this.#motor_V = 24;
        this.#motor_Enc_Res = 1000;
        this.waitForSensor = false;
        this.pkgArriving = false;
        this.consPkg = 0;
        this.#port_Distance = 5 + Math.floor((this.#port - 1) / 2) * 2;
    }
    //Timer for multiple packages. Clear when Arm has successfully opened
    pkgTimer = [];
    //Timer: waiting for respond from Arm. Clear when Arm has responded. Log error if timeout
    #errTimeout;
    //Timer for closing opened Arm
    #closeTimer;
    get curPort() {
        return this.#port;
    }
    get curDeliveryPartner() {
        return this.#deli_ptnr;
    }
    get curVoltage() {
        return this.#motor_V;
    }
    get curEncoderResolution() {
        return this.#motor_Enc_Res;
    }
    get distFromSensor() {
        return this.#port_Distance;
    }
    get timeTrvlr() {
        //return (this.#port_Distance / conveyor.speed) * 1000 //Not yet fully implemented
        return 5000;
    }
    get closeTimer() {
        return this.#closeTimer;
    }
    set newDeliveryPartner(deliveryPartner) {
        if (deliPartner.includes(deliveryPartner))
            this.#deli_ptnr = deliveryPartner;
        else
            alert(`${deliveryPartner} is not a Delivery Partner!`);
    }
    set newMotorVoltage(voltage) {
        if (availableMotorVoltage.includes(voltage)) this.#motor_V = voltage;
        else alert(`${voltage} is not a motor voltage!`);
    }
    set moveArm(distance) {
        if (distance >= limitDistance[0] && distance <= limitDistance[1]) this.#port_Distance = distance;
        else alert(`Please adjust distance between ${limitDistance[0]} and ${limitDistance[1]}`);
    }
    set closeTimer(timerId) {
        this.#closeTimer = timerId;
    }

    addPkgTimer(timerId, packageId) {
        this.pkgTimer.push(new PkgTimerObj(timerId, Date.now(), this.timeTrvlr, packageId));
    }

    newCvyrSpdHndl(newSpeed) {
        //Not yet implemented
        for (const i = 0; i < this.pkgTimer.length; i++) {
            const pkgObj = this.pkgTimer.shift();
            this.addPkgTimer(setTimeout(() => { this.sensorWaiting(); }, (this.#port_Distance - (Date.now() - pkgObj.startTime) * PARAM.ArmParams.CnvySpd) * 1000 / newSpeed), pkgObj.packageId);
        }
        //Re-set all timer in pckgTimer
    }

    sortCmplt() {
        const pkgTimer = this.pkgTimer.shift()
        clearTimeout(pkgTimer.id);
        logger.info(`[PkgID: ${pkgTimer.packageId}] sorted to port ${this.#port}`);
        socket.emit('success', pkgTimer.packageId);
    }

    reset() {
        this.pkgTimer.length = 0;
    }

    cnfHndl() {
        clearTimeout(this.#errTimeout);
    }

    noCnfHndl() {
        console.error("Arm not responding");
        const pkgInfo = this.pkgTimer.shift()
        logger.error(`Failed to sort [PkgID: ${pkgInfo.packageId}] to port ${this.#port}`);
        logger.error(`Port ${this.#port} not responding!!!`)
        clearTimeout(this.#closeTimer);
        clearTimeout(pkgInfo.id);
        socket.emit('err', pkgInfo.packageId);
    }

    adjPkgCheck() {
        try {
            if ((this.pkgTimer[this.consPkg].ariveTime() - Date.now()) <= (PARAM.PkgDistance / this.conveyorSpeed) * 2000) return true;
            else return false;
        }
        catch { return false; }
    }

    sensorWaiting() {
        this.pkgArriving = true;
        this.pkgArrvTimeout = setTimeout(() => {
            this.pkgArriving = false;
            const pkgInfo = this.pkgTimer.shift();
            logger.error(`Failed to sort [PkgID: ${pkgInfo.packageId}] to port ${this.#port}`);
            logger.error(`No sensor signal detected on port ${this.#port}!!!`);
            console.log("Error: No sensor detected!");
        }, PARAM.PkgArvTimeout);
    }

    switchSensorUsage(isUse) {
        for (const i = 0; i < this.pkgTimer.length; i++) {
            const pkgObj = this.pkgTimer.shift();
            try {
                this.addPkgTimer(setTimeout(() => { this.sensorWaiting(); }, pkgObj.duration - (Date.now() - pkgObj.startTime) - (2 * isUse - 1) * PARAM.PkgArvTimeout / 2), pkgObj.packageId);
            }
            catch { };
            this.waitForSensor = isUse;
            console.log(this.waitForSensor);
        }
    }

    armOpenMsg() {
        console.log(`Arm opening at port ${this.#port}`);
        const msg_obj = {
            id: this.#canId,
            length: 8,
            data: Buffer.from([0x00, PARAM.Id.Center, PARAM.MsgCode.CenterCmd, PARAM.CenterCmd.Open, 0x00, 0x00, 0x00, 0x00])
        }
        this.#errTimeout = setTimeout(() => { this.noCnfHndl(); }, 200);
        return msg_obj;
    }

    armCloseMsg() {
        console.log(`Arm closing at port ${this.#port}`);
        const msg_obj = {
            id: this.#canId,
            length: 8,
            data: Buffer.from([0x00, PARAM.Id.Center, PARAM.MsgCode.CenterCmd, PARAM.CenterCmd.Close, 0x00, 0x00, 0x00, 0x00])
        }
        return msg_obj;
    }
}

Arm.prototype.conveyorSpeed = 1;

module.exports = Arm;