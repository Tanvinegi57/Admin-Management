const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const education = sequelize.define(
  "education",
  {
    eduId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    eduName: {
      type: DataTypes.STRING,
      allowNull: true,
      //   defaultValue: 0,
    },
    isBlocked: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

module.exports = education;
