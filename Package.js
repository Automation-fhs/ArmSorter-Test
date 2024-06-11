const mongoose = require("mongoose");

//--------------Create database template-------------
const packageSchema = new mongoose.Schema({
    pid: {
        type: Number,
        required: true,
        unique: true
    },
    deliveryPartner: String
})

module.exports = mongoose.model('package', packageSchema);