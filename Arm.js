const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const dataObj = JSON.parse(data);
const deliPartner = dataObj.map(el => { return el.partnerName });
const { exec } = require('child_process');

let availableMotorVoltage = [5, 9, 12, 24, 36, 48, 96, 110, 220];
let limitDistance = [0, 20];

class Arm {
    #port;
    #port_Distance;
    #deli_ptnr;
    #motor_V;
    #motor_Enc_Res;
    constructor(position, delivery_partner) {
        this.#port = position;
        this.#deli_ptnr = delivery_partner;
        this.#motor_V = 24;
        this.#motor_Enc_Res = 1000;
    }
    get curPosition() {
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
    armOpen() {
        console.log(`Arm opening at port ${this.#port}`);
        exec('cansend can0 100#43114e2054657374', (err) => {
            if (err) console.log(err);
        })
        setTimeout(() => { this.armClose(); }, 1500);
    }

    armClose() {
        console.log(`Arm closing at port ${this.#port}`);
    }

}

module.exports = Arm;