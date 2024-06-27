class PkgTimerObj {
    id;
    startTime;
    duration;
    constructor(id, startTime, duration) {
        this.id = id;
        this.startTime = startTime;
        this.duration = duration;
    }
}

module.exports = PkgTimerObj;