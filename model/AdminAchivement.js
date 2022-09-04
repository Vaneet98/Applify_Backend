const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;


const adminAchiv = sequelize.define(
    "adminAchivement",
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     Type:{
        type:DataTypes.STRING
     }
    },
    {
      freezeTableName: true,
      deletedAt: "destroyTime",
      paranoid: true,
    }
  );
  
  module.exports = adminAchiv;
  