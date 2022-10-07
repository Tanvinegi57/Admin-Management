const Model = require("../model");
const { Op } = require("sequelize");

exports.createData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.employeeEducation
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
    Model.employeeEducation
      .findOne({
        where: {
          [Op.and]: [
            { employeeId: data.employeeId },
            { eduName: data.eduName },
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
