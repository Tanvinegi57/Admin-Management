require("dotenv").config();
const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");

let educationProjection = [
  "eduId",
  "eduName",
  "isBlocked",
  "createdAt",
  "deletedAt",
];

module.exports = {
  addEducation: async (data) => {
    const schema = Joi.object({
      eduName: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
    });
    let payload = await Helper.verifyjoiSchema(data, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      const eduDatas = {
        eduName: payload.eduName,
      };
      let education = await Service.EduService.findData(eduDatas);
      if (!education) {
        let createQualification = await Service.EduService.createData(eduDatas);
        return {
          status: 200,
          message: "Qualification added successfully",
          data: createQualification,
        };
      }
      return {
        status: 400,
        message: "Qualification already exists.",
      };
    }
  },

  blockUnblock: async (d) => {
    let data = {
      eduId: d.eduId,
    };
    let education = await Service.EduService.getData(data);
    if (education.isBlocked === 0) {
      let blockEducation = await Service.EduService.block(data);
      return {
        status: 200,
        message: "Successfully blocked the qualification",
        data: blockEducation,
      };
    } else {
      let unblockEducation = await Service.EduService.Unblock(data);
      return {
        status: 201,
        message: "Successfully Unblock the qualification",
        data: unblockEducation,
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
    let education = await Service.EduService.getAllDetails(
      payload,
      educationProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (education) {
      return education;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },

  edit: async (d, req, res) => {
    const schema = Joi.object({
      eduName: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
    });
    let payload = await Helper.verifyjoiSchema(d, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let data = {
        eduId: req.params.eduId,
        eduName: payload.eduName,
      };
      let user = await Service.EduService.getData(data);
      if (user) {
        let user = await Service.EduService.edit(data);
        return {
          status: "success",
          message: "Sucessfully edited the qualification.",
        };
      }
      return {
        status: "failed",
        message: "Not able to edit data.",
      };
    }
  },

  getIndividualEducation: async (data, req, res) => {
    const userData = {
      eduId: data.eduId,
    };
    const user = await Service.EduService.getIndividualEducation(userData);
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

  getEducationQualification: async (data) => {
    const user = await Service.EduService.getEducationQualification(data);
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
};
