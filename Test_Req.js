//Testing Push Pull github
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const event = require(`${__dirname}/event.js`);
const PackageSchema = require(`${__dirname}/Schema.js`);
require(`${__dirname}/PortEvent.js`)

dotenv.config({path: './config.env'});

//---------------Connect to database-----------------
mongoose
    .connect(process.env.DATABASE_LOCAL)
    .then(connect=> {
    //console.log(connect.connections);
    console.log("DB connected!");
    //console.log(mongoose.package.find(id=1));
    });

async function sort(id) {
    const partner = await PackageSchema.findOne({pid: id});
    console.log(partner.deliveryPartner);
    event.emit("armID", partner.deliveryPartner);
}

async function dbupdate(id, dPartner, res) {
    const partner = await PackageSchema.findOne({pid: id});
    if(partner == null) {
        const newPackage = new PackageSchema({
            pid: id,
            deliveryPartner: dPartner
        });
        newPackage.save();
        res.status(200).json({
            status: "success",
            data: {
                pid: id,
                deliveryPartner: dPartner
            }
        })
        res.end();
    }
    else {
        res.status(406).json({
            status: "error",
            message: "Package id already exist!"
        })
        res.end();
    }
}

// -------Get Delivery Partner from Package ID from server---------
app.get('/api/package/:id', (req, res) => {
    const id = req.params.id*1;
    console.log("Requesting");
    sort(id);
    res.status(200).json({
        status: "success",
    });
    res.end();
});

app.get('/api/newpackage', (req, res) => {
    const id = req.query.id*1;
    const dPartner = req.query.dp;
    dbupdate(id, dPartner, res);
})

const port = 3030;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

