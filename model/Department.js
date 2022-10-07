const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const department = sequelize.define(
  "department",
  {
    deptId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    DeptName: {
      type: DataTypes.STRING,
      allowNull: true,
      //   defaultValue: 0,
    },

    isBlocked: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },

    salaryType: {
      type: DataTypes.STRING,
      // defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "salary",
        key: "salaryType",
      },
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = department;
