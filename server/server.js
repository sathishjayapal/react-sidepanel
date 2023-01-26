import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {Database} from 'sqlite-async';
// import * as microsoftTeams from '@microsoft/teams-js';


import {
    initializeIdentityService
} from './identityService.js';

import {
    rtpFundTransfer,
    getTxnDetails
} from './usbobService.js';

dotenv.config();
const app = express();

// JSON middleware is needed if you want to parse request bodies
app.use(express.json());
app.use(cookieParser());

// Allow the identity service to set up its middleware
// await initializeIdentityService(app);

// microsoftTeams.getContext((context) => {
//   const userId = context.userObjectId;
//   const username = context.upn;
//   console.log(`User ID: ${userId}`);
//   console.log(`Username: ${username}`);
// });


app.get("/api/v1", async (req, res) => {
    // const message = {};
    res.json({"message": "Hello from server"});
    console.log("Hello");
    // res.send(message);
});


// app.get('/api', async(req, res) => {
//   try{
//     console.log('api');

//   }
//   catch (error){
//       console.log(`Error in /api handling: ${error}`);
//       res.status(500).json({status: 500, statusText: error });

//   }
// }) 

app.post('/api/rtpfundtransfer', async (req, res) => {
    try {

        console.log("api/rtpfundtransfer");
        var invid = req.body.id;
        var acctno = req.body.acctno;
        var routno = req.body.routno;
        console.log(invid, acctno, routno);
        const bankRTPRes = await rtpFundTransfer(invid, acctno, routno);
        res.send(bankRTPRes);
    } catch (error) {
        console.log(`Error in /api/rtpfundtransfer handling: ${error}`);
        res.status(500).json({status: 500, statusText: error});
    }

});

app.get('/api/getinvoices', async (req, res) => {
    var result = [];
    try {

        await Database.open('falconDB/falconDb')
            .then(async db => {

                result = await db.all(`select * from t_invoicelist`, []);
            })
            .catch(err => {
                console.log(err);
            });
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log(`Error in /api/getinvoices handling: ${error}`);
        res.status(500).json({status: 500, statusText: error});
    }
})


app.get('/api/getinvoiceitems', async (req, res) => {
    var result = [];
    try {

        await Database.open('falconDB/falconDb')
            .then(async db => {

                result = await db.all(`select * from t_invoices`, []);
            })
            .catch(err => {
                console.log(err);
            });
        res.send(result);
    } catch (error) {
        console.log(`Error in /api/getinvoiceitems handling: ${error}`);
        res.status(500).json({status: 500, statusText: error});
    }
})


// Make environment values available on the client side
// NOTE: Do not pass any secret or sensitive values to the client!
app.get('/modules/env.js', (req, res) => {
    res.contentType("application/javascript");
    res.send(`
    export const env = {
    };
  `);
});


// Serve static pages from /client
app.use(express.static('client/public'));

//start listening to server side calls
const PORT = process.env.PORT || 3978;
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
