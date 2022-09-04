const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;


const adminAchiv2 = sequelize.define(
    "adminAchivementLink",
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
     achivementId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
            model: "adminachivement",
            key: "Id",
        },
     }
    },
    {
      freezeTableName: true,
      deletedAt: "destroyTime",
      paranoid: true,
    }
  );
  
  module.exports = adminAchiv2;
   