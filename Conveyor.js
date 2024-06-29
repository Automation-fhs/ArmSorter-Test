const arm = require(`${__dirname}/Arm.js`);
const PARAM = require(`${__dirname}/params.js`);

class ConveyorEncoder {
    #speed;
    #canId;
    constructor(ConveyorCanId) {
        this.#canId = ConveyorCanId;
    }
    get speed() {
        return this.#speed;
    }

    newCvyrSpd(speed) {
        arm.array.forEach(el => {
            el.newCvyrSpdHndl(this.#speed, speed);
        });
        this.#speed = speed;
    }

    get encCanId() {
        return this.#canId;
    }
}

conveyor = new ConveyorEncoder(PARAM.Id.Conveyor);

module.exports = conveyor;

