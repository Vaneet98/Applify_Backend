const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware = require("../middleware/Middleware");
const sendResponse=require("../helper/sendResponse")
//1. Notificatiion send api
router.post(
  "/sendNotification",
  controller.AdminRegister.upload.single("image"),
  (req, res) => {
    return sendResponse.executeMethod(
      controller.NotificationController.addNotification,
      req.body,
      req,
      res
    );
  }
);

//2.Get all details
router.get("/list", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    controller.NotificationController.viewAll,
    payload,
    req,
    res
  );
});



//3.admin edit the details  IsAuth, Middleware.EditPermis,
router.put(
  "/edit/:notificationId",
 
  (req, res) => {
    return sendResponse.executeMethod(
      controller.NotificationController.edit,
      req.body,
      req,
      res
    ); 
  }
);

//4. Delete user   IsAuth, Middleware.DeletePermis,
router.delete(
  "/delete/:notificationId",
  (req, res) => {
    return sendResponse.executeMethod(
      controller.NotificationController.deleteperson,
      req.params,
      req,
      res
    );
  }
);
module.exports = router;
 