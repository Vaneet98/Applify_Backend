const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/connectionDB").sequelize;

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },

    email: {
      type: DataTypes.STRING,
      trim: true,
      defaultValue: 0,
    },

    password: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    Isblocked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    googleId: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    facebookID: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    gender: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    age: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    address: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    resetToken: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
