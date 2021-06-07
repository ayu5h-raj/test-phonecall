const Sequelize = require("sequelize");
const mysql = require('mysql2/promise');
const dbConfig = require("./config/db.config.js");


module.exports = db = {};

initialize()

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

async function initialize() {
    // create db if it doesn't already exist
    const connection = await mysql.createConnection({ 
        host: dbConfig.HOST,
        port: dbConfig.PORT , 
        user: dbConfig.USER, 
        password: dbConfig.PASSWORD 
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);

    // connect to db
    const sequelize = new Sequelize(dbConfig.DB,  dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: 'mysql'
    });

    db.CallRecord =  CallRecord

    await sequelize.sync();

    connectDb()
}

