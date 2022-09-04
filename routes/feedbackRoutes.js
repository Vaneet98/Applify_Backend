const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const Middleware= require("../middleware/Middleware.js") 
const sendResponse=require("../helper/sendResponse")
//1. Add feedback
  router.post(
    "/feed/addFeed",
    (req, res) => {
      return sendResponse.executeMethod(
        controller.feedbackController.createFeed,
        req.body,
        req,
        res
      );
    }
  );
  
//2. Get detail of feedback
  router.get(
    "/feed/view/:id",
    (req, res) => {
      return sendResponse.executeMethod(
        controller.feedbackController.getParticularFeedBack,
        req.body,
        req,
        res
      );
    }
  );
  

//3. Delete the feedback  

  router.delete(
    "/feed/deleteFeed",IsAuth,Middleware.DeletePermis,
    (req, res) => {
      return sendResponse.executeMethod(
        controller.feedbackController.DeleteFeed,
        req.body,
        req,
        res
      );
    }
  );


//4.View Rating
router.get(
  "/ratingAndComment",
  (req, res) => {
    let payload = req.query;
    if (payload.skip && payload.limit && payload.skip > 0) {
      payload.skip = (payload.skip - 1) * payload.limit;
    }
    return sendResponse.executeMethod(
      controller.feedbackController.getratting,
      payload,
      req,
      res
    );
  }
);

  module.exports = router;  