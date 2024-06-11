const EventEmitter = require('events');

class MyEmitter extends EventEmitter{
    constructor() {
        super();
    }
}

const myEmitter = new MyEmitter();

module.exports = myEmitter;