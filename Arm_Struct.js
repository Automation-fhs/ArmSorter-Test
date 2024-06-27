const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const dataObj = JSON.parse(data);
const deliPartner = dataObj.map(el => { return el.partnerName });
const { exec } = require('child_process');
//const channel = require(`${__dirname}/CAN_msg.js`);
const PARAM = require(`${__dirname}/params.js`);
const PkgTimerObj = require(`${__dirname}/pkgTimerObj.js`);
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
    constructor(position, delivery_partner) {
        this.#port = position;
        this.#canId = 0x0100 + this.#port;
        this.#deli_ptnr = delivery_partner;
        this.#motor_V = 24;
        this.#motor_Enc_Res = 1000;
    }
    pkgTimer = [];
    #errTimeout;
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
    set addPkgTimer(timerId) {
        this.pkgTimer.push(new PkgTimerObj(timerId, Date.now(), this.timeTrvlr));
    }

    newCvyrSpdHndl() {
        //Not yet implemented
        //Re-set all timer in pckgTimer
    }

    sortCmplt() {
        //Not yet implemented
        //Send back to server + write log
    }

    reset() {
        this.pkgTimer.length = 0;
    }

    armOpenMsg() {
        console.log(`Arm opening at port ${this.#port}`);
        const msg_obj = {
            id: this.#canId,
            length: 8,
            data: Buffer.from([0x00, PARAM.Id.Center, PARAM.MsgCode.CenterCmd, PARAM.CenterCmd.Open, 0x00, 0x00, 0x00, 0x00])
        }
        this.#errTimeout = setTimeout(() => { this.noCnfHndl(); }, 200);
        clearTimeout(this.pkgTimer.shift().id);
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

    cnfHndl() {
        clearTimeout(this.#errTimeout);
    }

    noCnfHndl() {
        console.error("Arm not responding");
        clearTimeout(this.#closeTimer);
    }
}

module.exports = Arm;