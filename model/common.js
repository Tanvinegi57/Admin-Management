const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const common = sequelize.define(
  "common",
  {
    commonId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    employeeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },

    deptId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "department",
        key: "deptId",
      },
    },

    DeptName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    eduId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "education",
        key: "eduId",
      },
    },

    eduName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // salaryId: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: true,
    //   references: {
    //     model: "salary",
    //     key: "salaryId",
    //   },
    // },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = common;
