const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const Sequelize = require("sequelize");
const dbConfig = require("./config/db.config.js");
const app = express();

require('dotenv').config();
app.use(morgan('common'))
app.use(cors())
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'mysql'
});


const CallRecord = sequelize.define("CallRecord", {
    sid: {
        primarykey: true,
        type: Sequelize.STRING
    },
    to: {
        type: Sequelize.STRING
    },
    from: {
        type: Sequelize.STRING
    },
    startTime: {
        type: Sequelize.DATE
    }
}, {
    freezeTableName: true,
});



const connectDb = async () => {
    try {
        await sequelize.authenticate();

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


connectDb();

(async () => {
    await sequelize.sync();
})();

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
            console.log(call)
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
        sid: receivedBody.sid,
        to: receivedBody.toPhone,
        from: receivedBody.fromPhone,
        startTime: receivedBody.startTime
    });
    res.send(call);
});

app.post('/saveData', (req, res) => {

})

app.listen(process.env.PORT, () => {
    console.log(`server started on http://localhost:${process.env.PORT}`)
})