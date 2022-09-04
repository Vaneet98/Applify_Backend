const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const category = sequelize.define(
  "category",
  {
    cId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type:DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    paranoid: true,
    deletedAt:"deletedTime"
  }
);

module.exports = category;