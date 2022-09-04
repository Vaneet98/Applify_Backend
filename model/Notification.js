const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;
 
const notification = sequelize.define(
  "notification",
  {
    notificationId: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    // userId: {
    //   type: Sequelize.DataTypes.UUID,
    //   references: {
    //     model: "admintable",
    //     key: "adminId",
    //   },
    // },
    userType: {
      type: Sequelize.DataTypes.STRING,
    },
    notification: {
      type: Sequelize.DataTypes.STRING,
    },
    image:{
      type:DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    paranoid: true,
    deletedAt: 'destroyTime', 
  }
);

module.exports = notification;