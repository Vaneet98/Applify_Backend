const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const admin = sequelize.define(
  "admintable",
  {
    adminId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: "super-Admin"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      
    },
    image: {
      type: DataTypes.STRING,
    },
    Isblocked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    RegistrationPermission: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    BlockedPermission: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    UnblockedPermission: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    DeletedPermission: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    EditPermission: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    deletedAt: "destroyTime",
    paranoid: true,
  }
);

module.exports = admin;
