const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const employeeEdu = sequelize.define(
  "employeeEdu",
  {
    eEduId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    eduName: {
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
    employeeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    empdeptId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: "employeeDept",
        key: "edId",
      },
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = employeeEdu;
