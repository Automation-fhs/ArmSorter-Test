class PkgTimerObj {
    packageId;
    id;
    startTime;
    duration;
    constructor(id, startTime, duration, packageId) {
        this.id = id;
        this.startTime = startTime;
        this.duration = duration;
        this.packageId = packageId;
    }
    ariveTime() {
        return this.startTime + this.duration;
    }
}

module.exports = PkgTimerObj;