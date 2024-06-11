const event = require(`${__dirname}/event.js`);
const fs = require('fs');
const portNavigate = require(`${__dirname}/PortNavigate.js`);
const partnerData = fs.readFileSync(`${__dirname}/data/Delivery_Partner.json`, 'utf-8');
const partnerObj = JSON.parse(partnerData);

//------------Emit Signal to port-------------
event.on("armID", (partnerName) => {
    const partner = partnerObj.find(el => el.partnerName === partnerName);
    console.log(partner);
    portNavigate(partner.port);
})

module.exports = event;