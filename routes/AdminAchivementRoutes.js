const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware = require("../middleware/Middleware.js");
const sendResponse = require("../helper/sendResponse");

//1. Admin achivement add
router.post(
    "/AddAchivement",
    (req, res) => {
      return sendResponse.executeMethod(
        controller.AdminAchivement.Add,
        req.body,
        req,
        res
      );
    }
  );

//2. Put filter and view achivement by name type and limit skip and assceding/Decending
  router.get("/list", (req, res) => {
    let payload = req.query;
    if (payload.skip && payload.limit && payload.skip > 0) {
      payload.skip = (payload.skip - 1) * payload.limit;
    }
    return sendResponse.executeMethod(
      controller.AdminAchivement.getAllAdminsAchivement,
      payload,
      req,
      res
    );
  }); 
//3 Edit admin achivement , IsAuth, Middleware.EditPermis
router.put("/edit/:Id", (req, res) => {
    return sendResponse.executeMethod(
      controller.AdminAchivement.edit,
      req.body,
      req,
      res
    );
  });

//4. Delete the Admin achivement   , IsAuth, Middleware.DeletePermis
  router.delete("/delete/:Id" , (req, res) => {
    return sendResponse.executeMethod(
      controller.AdminAchivement.deleteAchivement,
      req.body,
      req,
      res
    );
  });
  
  router.get(
    "/list/:Id",
    (req, res) => {
      return sendResponse.executeMethod(
       controller.AdminAchivement.list,
        req.body,
        req,
        res
      );
    }
  );

module.exports = router;