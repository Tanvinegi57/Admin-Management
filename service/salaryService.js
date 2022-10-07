const Model = require("../model");
const { Op } = require("sequelize");

exports.findData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.salary
      .findOne({
        where: {
          salaryType: data.salaryType,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the department.", error);
      });
  });
};

exports.createData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.salary
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the User", error);
      });
  });
};

exports.getData = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .findOne({
        where: { salaryId: data.salaryId },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//block the department
exports.block = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .update({ isBlocked: 1 }, { where: { salaryId: data.salaryId } })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//block the department
exports.Unblock = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .update({ isBlocked: 0 }, { where: { salaryId: data.salaryId } })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.edit = (d) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .update(
        {
          minSalary: d.minSalary,
          maxSalary: d.maxSalary,
        },
        {
          where: { salaryId: d.salaryId },
        }
      )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getAllDetails = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy
        ? criteria.sortBy
        : "createdAt" ||
          "salaryType" ||
          "salaryId" ||
          "minSalary" ||
          "maxSalary",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        salaryType: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  if (criteria && criteria.salaryType) {
    where.salaryType = criteria.salaryType;
  }
  if (criteria && criteria.minSalary) {
    where = {
      minSalary: {
        [Op.lte]: criteria.minSalary,
      },
    };
  }
  if (criteria && criteria.maxSalary) {
    where = {
      maxSalary: {
        [Op.gte]: criteria.maxSalary,
      },
    };
  }

  if (criteria["isBlocked"] === 1) where.isBlocked = 1;
  if (criteria["isBlocked"] === 0) where.isBlocked = 0;

  return new Promise((resolve, reject) => {
    Model.salary
      .findAndCountAll({
        limit,
        offset,
        where: where,
        order: order,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getIndividualSalary = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .findOne({
        where: {
          salaryId: data.salaryId,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Add the education Qualification");
      });
  });
};

Model.salary.hasMany(Model.DepartmentModel, { foreignKey: "salaryType" });

exports.getIndividualSalaryDetails = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .findOne({
        where: {
          salaryId: data.salaryId,
        },
        include: [
          {
            model: Model.DepartmentModel,
            attributes: ["DeptName", "deptId"],
          },
        ],
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};

exports.getSalary = (data) => {
  return new Promise((resolve, reject) => {
    Model.salary
      .findAndCountAll({
        where: {
          isBlocked: 0,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Add the education Qualification");
      });
  });
};
