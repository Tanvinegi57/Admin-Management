const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controller/userController");
const sendRespose = require("../helper/sendResponse");

const isAuth = require("../middleware/IsAuth");

//1. REGISTERATION
router.post("/registration", (req, res) => {
  return sendRespose.executeMethod(
    userController.registration,
    req.body,
    req,
    res
  );
});
//2. update user
router.put("/updateUser", (req, res) => {
  return sendRespose.executeMethod(
    userController.updateUser,
    req.body,
    req,
    res
  );
});
//3. login
router.post("/login", (req, res) => {
  return sendRespose.executeMethod(userController.login, req.body, req, res);
});

//5. Get specific user detail using id
router.get("/list/:id", (req, res) => {
  return sendRespose.executeMethod(userController.list, req.body, req, res);
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("User logged out successfully!!");
  });
});

//6. Delete user
router.delete("/delete/:id", (req, res) => {
  return sendRespose.executeMethod(
    userController.deleteUser,
    req.params,
    req,
    res
  );
});

//7. edit user
router.put("/edit/:id", (req, res) => {
  return sendRespose.executeMethod(userController.editUser, req.body, req, res);
});

//8. Block the user
router.put("/block/:id", (req, res) => {
  return sendRespose.executeMethod(userController.block, req.params, req, res);
});

//9. association get api
router.get("/userDetails", (req, res) => {
  return sendRespose.executeMethod(
    userController.userDetails,
    req.body,
    req,
    res
  );
});

//10. DashBoard api
router.get("/dashboardApi", (req, res) => {
  return sendRespose.executeMethod(
    userController.dashboardApi,
    req.body,
    req,
    res
  );
});

module.exports = router;
