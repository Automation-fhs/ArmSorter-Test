//Testing Push Pull github
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const { channel } = require(`${__dirname}/CAN_msg.js`);
require(`${__dirname}/PkgEvent.js`)
const event = require(`${__dirname}/event.js`);
const PackageSchema = require(`${__dirname}/Schema.js`);

//-----------------------SOCKET IO-----------------------
const io = require('socket.io-client');
const serverURL = "http://172.27.1.38:1605";//process.env.SERVERURL;
const socket = io.connect(serverURL);

//-----------------------TCP SERVER BARCODE READER-----------------------
const net = require('net');
const server = net.createServer((socket) => {
    console.log("Client connected");
    socket.on('data', (data) => {
        //console.log(data);
        data_ascii = data.toJSON().data;
        msgStart = "";
        data_ascii.slice(0, 3).map(el => {
            msgStart += String.fromCharCode(el);
        })
        msgEnd = ""
        data_ascii.slice(data_ascii.length - 4, data_ascii.length).map(el => {
            msgEnd += String.fromCharCode(el);
        })
        msgData = ""
        data_ascii.slice(3, data_ascii.length - 4).map(el => {
            msgData += String.fromCharCode(el);
        })
        console.log(msgData);
        hndlData(msgData);
    })
})

function hndlData(barcode) {
    socket.emit('package', barcode);
}

server.listen(3333, () => console.log('listening'))

//-----------------------Env data-----------------------
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
        console.log(Date.now());
        console.log("DB connected!");
        //console.log(mongoose.package.find(id=1));
    });

// async function sort(id, res) {
//     const partner = await PackageSchema.findOne({ pid: id });
//     if (partner == null) {
//         res.status(400).json({
//             status: "error",
//             message: `No package with pid ${id}!`
//         })
//     }
//     else {
//         console.log(partner.deliveryPartner);
//         event.emit("armID", partner.deliveryPartner, id);
//         res.status(200).json({
//             status: "success",
//             message: `Redirect package to ${partner.deliveryPartner}`
//         })
//     }
//     res.end();
// }

// async function dbupdate(id, dPartner, res) {
//     const partner = await PackageSchema.findOne({ pid: id });
//     if (partner == null) {
//         const newPackage = new PackageSchema({
//             pid: id,
//             deliveryPartner: dPartner
//         });
//         newPackage.save();
//         res.status(200).json({
//             status: "success",
//             message: "New package registered",
//             data: {
//                 pid: id,
//                 deliveryPartner: dPartner
//             }
//         })
//     }
//     else {
//         res.status(409).json({
//             status: "error",
//             message: "Package id already exist!"
//         })
//     }
//     res.end();
// }

// -------Get Delivery Partner from Package ID from server---------
// app.get('/api/package/:id', (req, res) => {
//     const id = req.params.id * 1;
//     console.log("Requesting");
//     sort(id, res);
// });

// app.get('/api/newpackage', (req, res) => {
//     const id = req.query.id * 1;
//     const dPartner = req.query.dp;
//     dbupdate(id, dPartner, res);
// })

// const port = 3030;
// app.listen(port, () => {
//     console.log(`App running on port ${port}`);
// });

// async function sort(pkgInfo) {
//     if (pkgInfo == null);
//     else {
//         event.emit("armID", partner.deliveryPartner, id);
//     }
// }


function sort(pkgInfo) {
    event.emit('armID', pkgInfo);
}

// ------Socket IO Connect to server
socket.on("connect", () => {
    console.log("Connected to server");
})

socket.on('disconnect', () => {
    console.log("Disconnected from server");
})

socket.on('port', (pkgInfo) => {
    if (pkgInfo == null) {
        //Error log
    }
    else {
        sort(pkgInfo);
    }
})