const PARAM = {
    MsgCode: {
        Error: 0x00,
        CenterCmd: 0x01,
        cmdConf: 0x02,
        GETparams: 0x03,
        SETparams: 0x04,
        ArmRes: 0x05,
        TestCmd: 0x06
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
    PkgDistance: 1
}

module.exports = PARAM;