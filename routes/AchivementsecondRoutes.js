const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware = require("../middleware/Middleware.js");
const sendResponse = require("../helper/sendResponse");

//1.Add adminachivment second
router.post(
    "/AddAchivement",
    (req, res) => {
      return sendResponse.executeMethod(
        controller.AdminAchivementSecon.Add,
        req.body,
        req,
        res
      );
    }
  );
 
  //2 Edit admin achivement
router.put("/edit", IsAuth, Middleware.EditPermis, (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminAchivementSecon.edit,
    req.body,
    req,
    res
  );
});

//3. Delete the Admin achivement
router.delete("/delete" , IsAuth, Middleware.DeletePermis, (req, res) => {
  return sendResponse.executeMethod(
    controller.AdminAchivementSecon.deleteAchivement,
    req.body,
    req,
    res
  );
});

module.exports = router;