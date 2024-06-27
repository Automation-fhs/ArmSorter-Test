const fs = require('fs');
const partnerData = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const ARM = require(`${__dirname}/Arm_Struct.js`);
const arm = [];

//------------Create arm instances-------------
JSON.parse(partnerData).map(el => {
    arm[el.port] = new ARM(el.port, el.partnerName);
});

module.exports = arm;