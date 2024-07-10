const PARAM = {
    MsgCode: {
        Error: 0x00,
        CenterCmd: 0x01,
        cmdConf: 0x02,
        ArmSensor: 0x03,
        GETparams: 0x04,
        SETparams: 0x05,
        ArmRespond: 0x06,
        ArmConfChange: 0x07,
        TestCmd: 0x08
    },
    ErrCode: {
        MsgCodeFail: 0x00,
        CmdCodeFail: 0x01
    },
    Id: {
        Center: 0x0000,
        Conveyor: 0x0100
    },
    CenterCmd: {
        Open: 0x01,
        Close: 0x00
    },
    ArmParams: {
        conveyorSpeed: 0x00, //conveyor Speed
        CnvySpd: 0,
        isSensor: 0x01, //Check if arm is currently using sensor
        ArmCloseTime: 1000
    },
    PkgDistance: 1,
    PkgArvTimeout: 2000,
    maxConsPkg: 3,
    pulleyRadius: 0.07
}

module.exports = PARAM;