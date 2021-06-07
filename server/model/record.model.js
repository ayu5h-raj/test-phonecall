module.exports = (sequelize, Sequelize) => {
    const CallRecord = sequelize.define("callrecord", {
      sid: {
        type: Sequelize.STRING
      },
      to: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.STRING
      },
      duration:{
          type: Sequelize.STRING
      },
      startTime: {
          type: Sequelize.TIME
      }
    });
    return CallRecord;
  };