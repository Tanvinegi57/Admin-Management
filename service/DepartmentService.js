const Model = require("../model");
const { Op } = require("sequelize");

exports.createData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the User", error);
      });
  });
};

exports.findData = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findOne({
      where: {
        DeptName: data.DeptName,
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

exports.getData = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findOne({
      where: { deptId: data.deptId },
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
    Model.DepartmentModel.update(
      { isBlocked: 1 },
      { where: { deptId: data.deptId } }
    )
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
    Model.DepartmentModel.update(
      { isBlocked: 0 },
      { where: { deptId: data.deptId } }
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
      criteria.sortBy ? criteria.sortBy : "createdAt" || "DeptName" || "deptId",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        DeptName: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  if (criteria && criteria.DeptName) {
    where.DeptName = criteria.DeptName;
  }

  if (criteria["isBlocked"] === 1) where.isBlocked = 1;
  if (criteria["isBlocked"] === 0) where.isBlocked = 0;
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
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

exports.edit = (d) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.update(
      {
        DeptName: d.DeptName,
        salaryType: d.salaryType,
      },
      {
        where: { deptId: d.deptId },
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

exports.getIndividualDepartment = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findOne({
      where: {
        deptId: data.deptId,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Add the Department");
      });
  });
};

exports.getDepartment = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: {
        isBlocked: 0,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to get ALL the Department");
      });
  });
};

exports.getDatasBlocked = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: { isBlocked: 1 },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getDatasUnblock = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: { isBlocked: 0 },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getDatasall = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({})
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getDepartmentSalary = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: {
        salaryType: {
          [Op.eq]: "Level-1",
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to get ALL the Department");
      });
  });
};

exports.getDepartmentSalary2 = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: {
        salaryType: {
          [Op.eq]: "Level-2",
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to get ALL the Department");
      });
  });
};

exports.getDepartmentSalary3 = (data) => {
  return new Promise((resolve, reject) => {
    Model.DepartmentModel.findAndCountAll({
      where: {
        salaryType: {
          [Op.eq]: "Level-2",
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to get ALL the Department");
      });
  });
};
