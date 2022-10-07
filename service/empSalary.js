const Model = require("../model");
const { Op } = require("sequelize");

exports.createData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.employeeSalary
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
    Model.employeeSalary
      .findOne({
        where: {
          [Op.and]: [
            { employeeId: data.employeeId },
            { salaryType: data.salaryType },
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
