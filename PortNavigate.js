const fs = require('fs');
const partnerData = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const ARM = require(`${__dirname}/Arm.js`);
const arm = [];


//------------Create arm instances-------------
JSON.parse(partnerData).map(el => {
    arm[el.port] = new ARM(el.port, el.partnerName);
});

//console.log(arm[4].curDeliveryPartner);

function portNavigate(portID) {
    console.log(`Waiting for package navigate to port ${portID}`);
    setTimeout(() => {
        arm[portID].armOpen();
    }, 2000);
}

module.exports =  portNavigate;