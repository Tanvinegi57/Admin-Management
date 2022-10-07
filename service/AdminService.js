const Model = require("../model");
const { Op } = require("sequelize");

exports.getAdmins = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findOne({
      where: { email: data.email },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//check
exports.getAdmin = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findOne({
      where: { adminId: data.adminId },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
//check
exports.addAdmin = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//check
exports.getadminDetail = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findOne({
      where: criteria,
      attributes: projection,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
//check
//delete a person
exports.deleteperson = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.destroy({
      where: { adminId: data.adminId },
      // data
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//update the person

//firstly find the person
//check
exports.get = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findOne({
      where: { adminId: data.adminId },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
//block the person  check
exports.blockperson = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.update(
      { Isblocked: 1 },
      { where: { adminId: data.adminId } }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//unblock person   check
exports.unblockperson = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.update(
      { Isblocked: 0 },
      { where: { adminId: data.adminId } }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//Edit the user   check
exports.edit = (d) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.update(
      {
        adminId: d.adminId,
        RegistrationPermission: d.RegistrationPermission,
        BlockedPermission: d.BlockedPermission,
        UnblockedPermission: d.UnblockedPermission,
        DeletedPermission: d.DeletedPermission,
        EditPermission: d.EditPermission,
      },
      {
        where: { adminId: d.adminId },
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
exports.updatepassword = (email, hash) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.update(
      { password: hash },
      { where: { email: email } }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.updatepasswords = (adminId, hash) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.update(
      { password: hash },
      { where: { adminId: adminId } }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.updateData = (newdata) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.update(
      {
        name: newdata.name,
        title:newdata.title,
         dashBoardPermission: newdata.dashBoardPermission,
        userManagementPermission: newdata.userManagementPermission,
        NotificationPermission: newdata.NotificationPermission,
        reportPermission: newdata.reportPermission,
        adminPermission: newdata.adminPermission,
        systemConfigPermission: newdata.systemConfigPermission,
      },
      {
        where: {
          adminId: newdata.adminId,
        },
      }
    ).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

exports.getAllAdmins = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt"||"name"||"image"||"title"||"email",
      criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: { 
        name: {
          [Op.like]: "%" + criteria.search + "%",
        },
        email: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  if (criteria && criteria.title) {
    where.title = criteria.title;
  }
  where.destroyTime = null;
  if (criteria["Isblocked"] === 1) where.Isblocked = 1;
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findAndCountAll({
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
exports.getCount=()=>{
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findAndCountAll({
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
}

exports.getBlock=()=>{
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findAndCountAll({
      where:{Isblocked: 1}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
}


exports.getUnBlock=()=>{
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findAndCountAll({
      where:{Isblocked: 0}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
}
exports.editAdminProfile = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister
      .update(
        {
          name: data.name,
          image: data.image,
        },
        {
          where: {
            email: data.email,
          },
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