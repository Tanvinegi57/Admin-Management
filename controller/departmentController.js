require("dotenv").config();
const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
let departmentProjection = [
  "deptId",
  "DeptName",
  "isBlocked",
  "createdAt",
  "deletedAt",
];

module.exports = {
  addDepartment: async (data) => {
    const schema = Joi.object({
      DeptName: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
      salaryType: Joi.string()
        .valid("Level-1", "Level-2", "Level-3")
        .required(),
    });
    let payload = await Helper.verifyjoiSchema(data, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      const userDatas = {
        DeptName: payload.DeptName,
        salaryType: payload.salaryType,
      };
      let department = await Service.DepartmentSer.findData(userDatas);
      if (!department) {
        let createDepartment = await Service.DepartmentSer.createData(
          userDatas
        );
        return {
          status: 200,
          message: "Department added successfully",
          department: createDepartment,
        };
      }
      return {
        status: 400,
        message: "Department already exists.",
      };
    }
  },

  blockUnblock: async (d) => {
    let data = {
      deptId: d.deptId,
    };
    let department = await Service.DepartmentSer.getData(data);
    if (department.isBlocked === 0) {
      let blockDepartment = await Service.DepartmentSer.block(data);
      return {
        status: 200,
        message: "Successfully blocked the department",
        data: blockDepartment,
      };
    } else {
      let unblockDepartment = await Service.DepartmentSer.Unblock(data);
      return {
        status: 201,
        message: "Successfully Unblock the department",
        data: unblockDepartment,
      };
    }
  },

  getAllDetails: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      isBlocked: Joi.number().optional().allow(""),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    let department = await Service.DepartmentSer.getAllDetails(
      payload,
      departmentProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (department) {
      return department;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },

  edit: async (d, req, res) => {
    const schema = Joi.object({
      DeptName: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
      salaryType: Joi.string()
        .valid("Level-1", "Level-2", "Level-3")
        .required(),
    });
    let payload = await Helper.verifyjoiSchema(d, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let data = {
        deptId: req.params.deptId,
        DeptName: payload.DeptName,
        salaryType: payload.salaryType,
      };
      let user = await Service.DepartmentSer.getData(data);
      if (user) {
        let user = await Service.DepartmentSer.edit(data);
        return {
          status: "Success",
          message: "Sucessfully edited the department",
        };
      }
    }

    return {
      status: "Failed",
      message: "Not able to edit data.",
    };
  },

  getIndividualDepartment: async (data, req, res) => {
    const userData = {
      deptId: data.deptId,
    };
    const user = await Service.DepartmentSer.getIndividualDepartment(userData);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "No Record Found",
      };
    }
  },

  getDepartment: async (data) => {
    const user = await Service.DepartmentSer.getDepartment(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "No Record Found",
      };
    }
  },

  getsallrecorde: async (d, req, res) => {
    let userBlockedCount = await Service.DepartmentSer.getDatasBlocked();
    let BlockCount = userBlockedCount.count;
    let userUnBlockedCount = await Service.DepartmentSer.getDatasUnblock();
    let UnblockCount = userUnBlockedCount.count;
    let blockUnblockTotal = await Service.DepartmentSer.getDatasall();
    let total = blockUnblockTotal.count;
    return {
      BlockCount: BlockCount,
      UnblockCount: UnblockCount,
      blockUnblockTotal: total,
    };
  },

  getDepartmentSalary: async (data) => {
    const user = await Service.DepartmentSer.getDepartmentSalary(data);
    const countBySalaryLevel1 = user.count;
    const count1 = user.countBySalaryLevel1;

    const user1 = await Service.DepartmentSer.getDepartmentSalary2(data);
    const countBySalaryLevel2 = user1.count;

    const user2 = await Service.DepartmentSer.getDepartmentSalary3(data);
    const countBySalaryLevel3 = user2.count;

    return {
      status: 200,
      countBySalaryLevel1: countBySalaryLevel1,
      countBySalaryLevel2: countBySalaryLevel2,
      countBySalaryLevel3: countBySalaryLevel3,
    };
  },
};
