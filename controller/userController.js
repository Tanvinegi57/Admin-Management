require("dotenv").config();
const Service = require("../service");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
const otpGenerator = require("otp-generator");
// FOR NODEMAILER
const nodemailer = require("nodemailer");
const transporter = require("../config/emailConfig");
var unique;
var educationID;
var SalaryType;
var EDUCATION_DEPARTMENT;
var EMployee_Education;

module.exports = {
  registration: async (data) => {
    const schema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .optional(),
      email: Joi.string().email().optional(),
      gender: Joi.string().optional(),
      address: Joi.string().optional(),
      DOB: Joi.string().optional(),
      DateOfJoining: Joi.string().optional(),
      DeptName: Joi.string().optional(),
      eduName: Joi.string().optional(),
      salaryType: Joi.string().optional(),
    });
    let payload = await Helper.verifyjoiSchema(data, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      const userDatas = {
        email: payload.email,
      };

      var Password = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: true,
        lowerCaseAlphabets: true,
        specialChars: true,
      });
      const value = Password;
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(value, salt);

      let userData = {
        name: payload.name,
        email: payload.email,
        password: hashPassword,
        DOB: payload.DOB,
        gender: payload.gender,
        address: payload.address,
        DeptName: payload.DeptName,
        DateOfJoining: payload.DateOfJoining,
        salaryType: payload.salaryType,
        eduName: payload.eduName,
      };

      console.log("User details", userData);

      if (userDatas.email) {
        const user = await Service.userService.findUserByEmail(userDatas);
        if (!user) {
          const createuser = await Service.userService.registration(userData);
        }
      }

      // const token = jwt.sign({ adminId: user.id }, process.env.JWT_SECRET_KEY, {
      //   expiresIn: "4d",
      // });
      const userId = await Service.userService.findUserByEmail(userData);
      if (payload.DeptName) {
        var deptId = await Service.DepartmentSer.findData(userData);
        unique = deptId.deptId;

        if (deptId.isBlocked === 1) {
          return {
            message: "Department is blocked.",
          };
        }
      }
      if (payload.salaryType) {
        var salaryType = await Service.SalaryService.findData(userData);
        SalaryType = salaryType.salaryType;
        if (salaryType.isBlocked === 1) {
          return {
            message: "Salary range is blocked.",
          };
        }
      }
      if (payload.eduName) {
        var eduId = await Service.EduService.findData(userData);
        educationID = eduId.eduId;
        console.log("222222222", eduId);
        if (eduId.isBlocked === 1) {
          return {
            message: "Education is blocked.",
          };
        }
      }

      if (payload.DeptName) {
        var data = {
          DeptName: payload.DeptName,
          employeeId: userId.id,
          // deptId: deptId.deptId,
          deptId: unique,
        };
        console.log(data);
        if (data.DeptName) {
          console.log("66666666", data.DeptName);
          var findDept = await Service.EmployeeDeptService.findData(data);
          if (!findDept) {
            let department = await Service.EmployeeDeptService.createData(data);
            EDUCATION_DEPARTMENT = department.edId;
          }
        }
      }
      if (payload.eduName) {
        let eduData = {
          employeeId: userId.id,
          eduId: educationID,
          eduName: eduId.eduName,
          empdeptId: EDUCATION_DEPARTMENT,
        };
        const findEdu = await Service.EmployeeEduService.findData(eduData);
        if (!findEdu) {
          let education = await Service.EmployeeEduService.createData(eduData);
        }
        var findEmployeeEduId = await Service.EmployeeEduService.findData(
          eduData
        );
        EMployee_Education = findEmployeeEduId.eEduId;
      }

      if (payload.salaryType) {
        let salaryData = {
          employeeId: userId.id,
          salaryType: SalaryType,
          empEduId: EMployee_Education,
        };
        const findEdu = await Service.EmployeeSalaryService.findData(
          salaryData
        );
        if (!findEdu) {
          let education = await Service.EmployeeSalaryService.createData(
            salaryData
          );
        }
      }

      // else if (payload.eduName) {
      //   console.log("deparhjghj41212121tmentId", unique);
      //   let newdata = {
      //     employeeId: userId.id,
      //     eduId: eduId.eduId,
      //     eduName: eduId.eduName,
      //     empdeptId: unique,
      //   };
      //   console.log("###########", newdata);

      //   if (data.eduName) {
      //     const findEdu = await Service.EmployeeEduService.findData(newdata);
      //     if (!findEdu) {
      //       let education = await Service.EmployeeEduService.createData(
      //         newdata
      //       );
      //       const findEdu = await Service.EmployeeEduService.findData(data);
      //       var educationId = findEdu.eduId;
      //     }
      //   }

      // } else if (payload.salaryType) {
      //   let newwdata = {
      //     employeeId: userId.id,
      //     salaryType: salaryType.salaryType,
      //     empEduId: educationId,
      //   };
      //   console.log(data);
      //   if (data.salaryType) {
      //     const findSalaryType = await Service.EmployeeSalaryService.findData(
      //       newwdata
      //     );
      //     if (!findSalaryType) {
      //       let salary = await Service.EmployeeSalaryService.createData(
      //         newwdata
      //       );
      //     }
      //   }
      // }
      // var transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: process.env.EMAIL_FROM,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });
      // //Send Email
      // let info = await transporter.sendMail({
      //   from: process.env.EMAIL_FROM,
      //   to: data.email,
      //   subject: "Password Reset link",
      //   html: `<h3>
      //     You have been added as an User, Your password is ${Password}.
      //       Please log in.
      //     </h3>`,
      // });
      return {
        status: 200,
        message: "User registration successfully",
        // info: info,
      };
    }
  },
  updateUser: async (data, req, res) => {
    const userData = {
      id: data.id,
      gender: data.gender,
      age: data.Age,
      address: data.Address,
    };
    console.log("USER DATA :", userData); /* User ka data frontend se */
    const user = await Service.userService.findUserById(userData);
    if (user) {
      if (req.user.id === userData.id) {
        const users = await Service.userService.updateUser(userData);
        console.log("USER", user); /* 1 */
        return {
          status: 200,
          message: "User Update successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            age: user.Age,
            address: user.Address,
          },
        };
      } else {
        return {
          status: 200,
          message: "User is not Authenticated",
        };
      }
    } else {
      return {
        status: 400,
        json: "User Does Not Exists",
      };
    }
  },
  login: async (data, req, res) => {
    const userData = {
      email: data.email,
      password: data.password,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        if (data.email && data.password) {
          const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (user.email && passwordMatch) {
            // Generate Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
            console.log(token);

            // Put Token in the cookies
            res.cookie("token", token, { expire: new Date() + 9999 });

            return {
              status: 200,
              message: "User loggedIn successfully",
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            };
          } else {
            return {
              status: 400,
              message: "UserName and Password Does Not match",
            };
          }
        }
      } else {
        return {
          status: 400,
          message: "User Does not exist in the database",
        };
      }
    } else {
      return {
        status: 400,
        message: "UserName Does not Exists in the Database",
      };
    }
  },
  changePassword: async (data, req, res) => {
    const userData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      id: data.id,
    };

    console.log(userData);

    const user = await Service.userService.findUserById(userData);
    if (user) {
      const passwordMatch = bcrypt.compare(oldPassword, user.password);
      if (passwordMatch) {
        const value = data.newPassword;
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(value, salt);

        const user = await Service.userService.changePassword(
          hashPassword,
          userData
        );
        return {
          status: 200,
          message: "Password Update Successfully",
        };
      }
    } else {
      return {
        status: 400,
        message: "User Does not Exists in the Database",
      };
    }
  },
  list: async (datas, req, res) => {
    let data = {
      id: req.params.id,
    };
    const user = await Service.userService.findUserById(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  deleteUser: async (data) => {
    const datas = {
      id: data.id,
    };
    let users = await Service.userService.get(datas);
    if (users) {
      let user = await Service.userService.deleteUser(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      // user: user,
    };
  },
  editUser: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .trim()
        .required(),
      phoneNumber: Joi.number().integer().required(),
    });
    let payload = await Helper.verifyjoiSchema(datas, schema);
    if (!payload) {
      return { status: 400, message: "Invalid strings types" };
    } else {
      let data = {
        id: req.params.id,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
      };
      let update = await Service.userService.updateData(data);
      if (update) {
        return {
          status: 200,
          message: "data updated successfully",
          update: update,
        };
      } else {
        return { status: 201, message: "Something is wrong" };
      }
    }
  },
  block: async (d) => {
    let data = {
      id: d.id,
    };
    let user = await Service.userService.get(data);
    if (user.Isblocked === 0) {
      let user = await Service.userService.blockperson(data);
      return {
        status: 200,
        message: "Sucessfull block the user",
      };
    } else {
      let user = await Service.userService.Unblockperson(data);
      return {
        status: 201,
        message: "Sucessfull Unblock the user",
      };
    }
  },

  userDetails: async (payload, req, res) => {
    let data = await Service.userService.userDetails();
    // let data1 = await Service.userService.userDetails1();
    // let data2 = await Service.userService.userDetails2();
    return {
      data,
    };
  },

  dashboardApi: async (payload, req, res) => {
    console.log("fhdfhdfgdhf");
  },
};
