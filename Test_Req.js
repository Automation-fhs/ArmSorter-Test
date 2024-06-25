//Testing Push Pull github
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const event = require(`${__dirname}/event.js`);
const PackageSchema = require(`${__dirname}/Schema.js`);
require(`${__dirname}/PortEvent.js`)

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL
    .replace('<USER>', process.env.USR)
    .replace('<PWD>', process.env.PASSWORD)
    .replace('<DBS>', process.env.DATABASE);

//console.log(DB);

//---------------Connect to database-----------------
mongoose
    .connect(DB)
    .then(connect => {
        //console.log(connect.connections);
        console.log("DB connected!");
        //console.log(mongoose.package.find(id=1));
    });

async function sort(id, res) {
    const partner = await PackageSchema.findOne({ pid: id });
    if (partner == null) {
        res.status(400).json({
            status: "error",
            message: `No package with pid ${id}!`
        })
    }
    else {
        console.log(partner.deliveryPartner);
        event.emit("armID", partner.deliveryPartner);
        res.status(200).json({
            status: "success",
            message: `Redirect package to ${partner.deliveryPartner}`
        })
    }
    res.end();
}

async function dbupdate(id, dPartner, res) {
    const partner = await PackageSchema.findOne({ pid: id });
    if (partner == null) {
        const newPackage = new PackageSchema({
            pid: id,
            deliveryPartner: dPartner
        });
        newPackage.save();
        res.status(200).json({
            status: "success",
            message: "New package registered",
            data: {
                pid: id,
                deliveryPartner: dPartner
            }
        })
    }
    else {
        res.status(409).json({
            status: "error",
            message: "Package id already exist!"
        })
    }
    res.end();
}

// -------Get Delivery Partner from Package ID from server---------
app.get('/api/package/:id', (req, res) => {
    const id = req.params.id * 1;
    console.log("Requesting");
    sort(id, res);
});

app.get('/api/newpackage', (req, res) => {
    const id = req.query.id * 1;
    const dPartner = req.query.dp;
    dbupdate(id, dPartner, res);
})

const port = 3030;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});