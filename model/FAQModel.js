const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

let FAQtable = sequelize.define(
    "FaqTable",
    {
      Faqid: {
        type: DataTypes.UUID,
        allowNull: false,
        required: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      FAQ: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unsolved",
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: 'destroyTime', 
    }
  );
  
  module.exports = FAQtable;