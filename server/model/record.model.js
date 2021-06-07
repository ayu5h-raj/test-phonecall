module.exports = (sequelize, Sequelize) => {
  const CallRecord = sequelize.define("callrecord", {
    name: {
      type: Sequelize.STRING,
    },
    sid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    to: {
      type: Sequelize.STRING
    },
    from: {
      type: Sequelize.STRING
    },
    startTime: {
      type: Sequelize.DATE
    },
  });
  return CallRecord;
};