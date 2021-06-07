const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

require('dotenv').config();
app.use(morgan('common'))
app.use(cors())
app.use(express.json());

const db = require("./model/index");
const CallRecord = db.CallRecord;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


app.get('/call', (req, res) => {
    const toNum = req.query.num1;
    const fromNum = req.query.num2;
    client.calls
        .create({
            twiml: '<Response><Say>Ahoy, World!</Say></Response>',
            to: toNum,
            from: fromNum
        })
        .then(call => {
            res.send({
                "sid": call.sid,
                "startTime": new Date()
            })
        });
})

app.post('/terminateCall', async (req, res) => {
    const receivedBody = req.body;
    console.log(receivedBody);
    const call = await client.calls(receivedBody.sid)
        .update({ status: 'completed' })
    await CallRecord.create({
        name: receivedBody.name,
        sid: receivedBody.sid,
        to: receivedBody.toPhone,
        from: receivedBody.fromPhone,
        startTime: receivedBody.startTime
    });
    res.send(call);
});


app.listen(process.env.PORT, () => {
    db.sequelize.sync();
    console.log(`server started on http://localhost:${process.env.PORT}`)
})