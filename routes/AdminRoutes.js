const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware = require("../middleware/Middleware.js");
const sendResponse = require("../helper/sendResponse");

//1. Registration for Admin only
router.post("/Registration", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.addAdmin,
    req.body,
    req,
    res
  );
});

//2. login admin
router.post("/login", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.loginAdmin,
    req.body,
    req,
    res
  );
});

//5 change password
router.post("/changepassword", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.changeUserPassword,
    req.body,
    req,
    res
  );
});

//3 set password
router.post("/setpassword", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.setpassword,
    req.body,
    req,
    res
  );
});

//4 Reset/change/Forget the password after send the code on Email
router.post("/send-reset-password-email", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.sendEmailForForgetPassword,
    req.body,
    req,
    res
  );
});

// //7 Update user name and profile
// router.put("/editAdminDetails/:adminId", (req, res) => {
//   return sendResponse.executeMethod(
//     controller.AdminRegister.editAdminDetails,
//     req.body,
//     req,
//     res
//   );
// });

//5. List all the admins that are blocked or not blocked, but not deleted, alongwith count of users. And also we can filter admins by their name, if admin wants to see only blocked admins then apply blocked filter, and if admin want to see only non blocked admins then apply that filter.
router.get("/list", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    controller.AdminRegister.getAllAdmins,
    payload,
    req,
    res
  );
});

//6 specific person details check
router.get("/lists/:adminId", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.getSpecificAdmins,
    req.params,
    req,
    res
  );
});

//7 Admin can block and unblock the user  IsAuth, Middleware.BlockePermis,
router.put("/block/:adminId", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.blockAndUnblock,
    req.params,
    req,
    res
  );
});

//8 admin edit the details
router.put("/edit", IsAuth, Middleware.EditPermis, (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.edit,
    req.body,
    req,
    res
  );
});

//9. Delete user    , IsAuth, Middleware.DeletePermis
router.delete("/delete/:adminId", (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.deleteperson,
    req.params,
    req,
    res
  );
});

//10. logged out
router.get("/loggedOut", IsAuth, (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminRegister.loggedOut,
    req.body,
    req,
    res
  );
});

// //11. Get all details of all models
// router.get("/graph", (req, res) => {
//   return sendResponse.executeMethod(
//     controller.AdminRegister.getAllDetails,
//     req.body,
//     req,
//     res
//   );
// });

//12 Profile Edit
// router.put(
//   "/editAdminProfile",
//   controller.AdminRegister.upload.single("image"),
//   (req, res) => {
//     return sendResponse.executeMethod(
//       controller.AdminRegister.editAdminProfile,
//       req.body,
//       req,
//       res
//     );
//   }
// );
module.exports = router;
