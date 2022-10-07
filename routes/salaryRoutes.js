const express = require("express");
const router = express.Router();
const controller = require("../controller");
const sendResponse = require("../helper/sendResponse");

router.post("/add", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.addSalary,
    req.body,
    req,
    res
  );
});

router.post("/block/:salaryId", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.blockUnblock,
    req.params,
    req,
    res
  );
});

router.put("/edit/:salaryId", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.edit,
    req.body,
    req,
    res
  );
});

router.get("/list", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    controller.salaryController.getAllDetails,
    payload,
    req,
    res
  );
});

router.get("/getIndividualSalary/:salaryId", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.getIndividualSalary,
    req.params,
    req,
    res
  );
});

router.get("/getIndividualSalaryDetails/:salaryId", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.getIndividualSalaryDetails,
    req.params,
    req,
    res
  );
});

router.get("/getSalary", (req, res) => {
  return sendResponse.executeMethod(
    controller.salaryController.getSalary,
    req.body,
    req,
    res
  );
});

module.exports = router;
