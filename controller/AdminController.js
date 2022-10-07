const _ = require("underscore");
const Service = require("../service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");
const nodemailer = require("nodemailer");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
const otpGenerator = require("otp-generator");

// var session = require('express-session');
let adminProjection = [
  "adminId",
  "name",
  "email",
  "title",
  "Isblocked",
  "createdAt",
];

module.exports = {
  addAdmin: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    let data = await Helper.verifyjoiSchema(datas, schema);
    if (!data) {
      return { message: "Invalid types" };
    } else {
      let userData = {
        name: data.name,
        email: data.email,
        // password: data.password,
      };
      const user = await Service.AdminService.getAdmins(userData);
      if (user) {
        return "already exists";
      } else {
        const value = data.password;
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(value, salt);

        let userDatas = {
          name: data.name,
          email: data.email,
          password: hashPassword,
        };

        const addUser = await Service.AdminService.addAdmin(userDatas);
        const token = jwt.sign(
          { adminId: addUser.adminId },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "4d",
          }
        );
        var transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
          },
        });

        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: data.email,
          subject: "Password Reset link",
          html: `<h3>
          You have been added as an Admin, please set your password by following the link below.
            Click on the <a href="${process.env.LINK}${token}">
              link
            </a>
            to reset your password
          </h3>`,
        });
        return {
          status: "success",
          msg: "registered",
          user: addUser,
          token: token,
          info: info,
        };
      }
    }
  },
  loginAdmin: async (datas, req, res) => {
    // try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    let data = await Helper.verifyjoiSchema(datas, schema);

    if (!data) {
      return { status: "failed", message: "Invalid strings types" };
    }
    const admindata = {
      email: data.email,
      password: data.password,
    };
    const user = await Service.AdminService.getAdmins(admindata);
    if (user.Isblocked === 1) {
      return { status: 404, message: "You are blocked " };
    }
    if (data.email && data.password) {
      const useremail = await Service.AdminService.getAdmins(admindata);

      if (useremail != null) {
        const isMatch = await bcrypt.compare(data.password, useremail.password);
        if (useremail.email && isMatch) {
          //Genterate token
          const token = jwt.sign(
            {
              adminId: useremail.adminId,
            },
            process.env.JWT_SECRET_KEY,

            {
              expiresIn: "15m",
            }
          );
          // Put token into cookie
          res.cookie("token", token, { expire: new Date() + 9999 });
          return {
            status: "Success",
            message: "Login success",
            token: token,
            adminId: useremail.adminId,
            userdetails: user,
          };
        } else {
          return {
            status: "failed",
            message: "Email or Password is not Valid",
          };
        }
      } else {
        return { status: "failed", message: "You are not Registered User" };
      }
    } else {
      return { status: "failed", message: "All fields are required" };
    }
    // } catch (error) {
    //   return { status: "failed", message: "Unabale to login" };
    // }
  },
  deleteperson: async (data) => {
    const datas = {
      adminId: data.adminId,
    };
    let users = await Service.AdminService.get(datas);
    if (users) {
      let user = await Service.AdminService.deleteperson(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      user: user,
    };
  },
  blockAndUnblock: async (d) => {
    let data = {
      adminId: d.adminId,
    };
    let user = await Service.AdminService.get(data);
    if (user.Isblocked === 0) {
      let user = await Service.AdminService.blockperson(data);
      return {
        status: 200,
        message: "Sucessfull block the user",
        user: user.Isblocked,
      };
    } else {
      let user = await Service.AdminService.unblockperson(data);
      return {
        status: 201,
        message: "Sucessfull unblock the user",
        user: user.Isblocked,
      };
    }
  },
  changeUserPassword: async (data, req, res) => {
    const { email, old_password, new_password, confirmPassword } = data;
    let criteria = { email: email };

    let admin = await Service.AdminService.getadminDetail(criteria);
    const isMatch = await bcrypt.compare(old_password, admin.password);
    if (!isMatch) {
      return { status: 402, message: "Wrong Old password" };
    } else if (new_password === confirmPassword) {
      var value = new_password;
      const salt = await bcrypt.genSalt(10);
      const newhashPassword = await bcrypt.hash(value, salt);

      await Service.AdminService.updatepassword(email, newhashPassword);

      return { status: 200, message: "Password change successfull" };
    } else {
      return {
        status: 403,
        message: "new_password and confirmPassword is not matched",
      };
    }
  },
  loggedOut: async (data, req, res) => {
    // req.session.destroy();
    res.clearCookie("token"); // Clear the cookier whose name is Token
    return { status: "Success", message: "Logged Out successfull" };
  },
  edit: async (d) => {
    let data = {
      adminId: d.adminId,
      RegistrationPermission: d.RegistrationPermission,
      BlockedPermission: d.BlockedPermission,
      UnblockedPermission: d.UnblockedPermission,
      DeletedPermission: d.DeletedPermission,
      EditPermission: d.EditPermission,
    };
    let user = await Service.AdminService.get(data);
    if (user) {
      let user = await Service.AdminService.edit(data);
      return {
        status: "Success",
        message: "Sucessfull edit the user",
      };
    }

    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
  sendEmailForForgetPassword: async (datas, req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    let payload = await Helper.verifyjoiSchema(datas, schema);
    console.log("playopld", payload);
    if (!payload) {
      return { status: 402, message: "Invalid strings types" };
    } else {
      let email = {
        email: payload.email,
      };

      if (email) {
        const user = await Service.AdminService.getAdmins(email);

        if (user) {
          const secret = user.adminId + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ adminId: user.adminId }, secret, {
            expiresIn: "15m",
          });
          // --- create frontend link ----
          const link = `http://127.0.0.1:3000/reset/${user.adminId}/${token}`;
          //-- But in ReactJS link link it /reset/:token---

          var transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_FROM,
              pass: process.env.EMAIL_PASS,
            },
          });
          //Send Email
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Password Set link",
            html: `<a href=${link}>Click here</a> to Set your password`,
          });
          return {
            status: "Success",
            message: "Password Set Email send....Please check the email",
            info: "info",
          };
        } else {
          return { status: "failed", message: "Email doesn't exists" };
        }
      } else {
        return { status: 401, message: "Email field is Required" };
      }
    }
  },
  setpassword: async (data, req, res) => {
    const { adminId, token, password, confirmPassword } = data;
    let criteria = { adminId: adminId };
    if (password === confirmPassword) {
      let admin = await Service.AdminService.getAdmin(criteria);
      let secret_key = admin.adminId + process.env.JWT_SECRET_KEY;
      const tokenVerify = jwt.verify(token, secret_key);
      console.log("token", tokenVerify);
      if (tokenVerify) {
        var value = password;
        const salt = await bcrypt.genSalt(10);
        const newhashPassword = await bcrypt.hash(value, salt);

        await Service.AdminService.updatepasswords(adminId, newhashPassword);

        return { status: 200, message: "Set Paassword successfull" };
      } else {
        return { status: 401, message: "Token Expired" };
      }
    } else {
      return {
        status: 201,
        message: "password and confirm password doesnt match",
      };
    }
  },
  editAdminDetails: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
      title: Joi.string(),
      dashBoardPermission: Joi.boolean().optional(),
      userManagementPermission: Joi.boolean().optional(),
      NotificationPermission: Joi.boolean().optional(),
      reportPermission: Joi.boolean().optional(),
      adminPermission: Joi.boolean().optional(),
      systemConfigPermission: Joi.boolean().optional(),
    });
    let payload = await Helper.verifyjoiSchema(datas, schema);
    if (!payload) {
      return { status: 401, message: "Invalid strings types" };
    } else {
      let data = {
        adminId: req.params.adminId,
        name: payload.name,
        title: payload.title,
        dashBoardPermission: payload.dashBoardPermission,
        userManagementPermission: payload.userManagementPermission,
        NotificationPermission: payload.NotificationPermission,
        reportPermission: payload.reportPermission,
        adminPermission: payload.adminPermission,
        systemConfigPermission: payload.systemConfigPermission,
      };
      let update = await Service.AdminService.updateData(data);
      if (update) {
        return {
          status: 200,
          message: "Data updated successfully",
          update: update,
        };
      } else {
        return { status: 201, message: "Something is wrong" };
      }
    }
  },
  getAllAdmins: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      title: Joi.string().optional().allow(""),
      Isblocked: Joi.number().optional(),
      name: Joi.string().optional(),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    let admins = await Service.AdminService.getAllAdmins(
      payload,
      adminProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (admins) {
      return admins;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  getSpecificAdmins: async (data) => {
    const datas = {
      adminId: data.adminId,
    };
    let users = await Service.AdminService.get(datas);
    if (users) {
      return users;
    }
  },
};
