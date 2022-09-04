const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;


const ReportContent = sequelize.define(
    "reportcontent",
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      ReportedBy: {
        type: DataTypes.STRING,
        
      },
     ReportedItem:{
        type:DataTypes.STRING
     },
     Status:{
        type:DataTypes.ENUM("pending", "approved", "declined"),
        defaultValue: "pending",
     },
     Date:{
      type:DataTypes.STRING,
     },
     Description:{
      type: DataTypes.STRING
     }
    },
    {
      freezeTableName: true,
      deletedAt: "destroyTime",
      paranoid: true,
    }
  );
  
  module.exports = ReportContent;
  