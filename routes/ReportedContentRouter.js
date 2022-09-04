const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware = require("../middleware/Middleware.js");
const sendResponse = require("../helper/sendResponse");

//1. Add reported content
router.post("/AddReported", (req, res) => {
  return sendResponse.executeMethod(
    controller.ReportedContentController.Add,
    req.body,
    req,
    res
  );
});
//2. Filter query
router.get("/list", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    controller.ReportedContentController.getAllReported,
    payload,
    req,
    res 
  );
});

//3. Edit status and description
router.put("/edit", IsAuth, Middleware.EditPermis, (req, res) => {
  return sendResponse.executeMethod(
    controller.ReportedContentController.edit,
    req.body,
    req,
    res
  );
});
module.exports = router;
 