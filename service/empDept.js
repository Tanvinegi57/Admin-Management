const Model = require("../model");
const { Op } = require("sequelize");

exports.createData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.employeeDept
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find data", error);
      });
  });
};
exports.findData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.employeeDept
      .findOne({
        where: {
          [Op.and]: [
            { employeeId: data.employeeId },
            { DeptName: data.DeptName },
          ],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find data", error);
      });
  });
};
