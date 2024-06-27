class PkgTimerObj {
    id;
    startTime;
    duration;
    constructor(id, startTime, duration) {
        this.id = id;
        this.startTime = startTime;
        this.duration = duration;
    }

    ariveTime() {
        return this.startTime + this.duration;
    }

}

module.exports = PkgTimerObj;