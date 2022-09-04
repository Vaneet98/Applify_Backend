const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const AppVersion = sequelize.define(
    "AppManagement",
    {
      AppId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      AppName:{
        type:DataTypes.STRING
      },
      plateform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      minimumVersion:{
        type:DataTypes.STRING,
        defaultValue:"1.0.0"
      },
      latestVersion:{
        type: DataTypes.STRING,
        defaultValue:"1.0.1"
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt:"deletedTime"
    }
  );
  
  module.exports = AppVersion;