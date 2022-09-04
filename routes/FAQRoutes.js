const express = require("express");
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const router = express.Router();
const Middleware= require("../middleware/Middleware.js")
const sendResponse=require("../helper/sendResponse") 

//1.FAQ create
router.post(
  "/add",
  (req, res) => {
    return sendResponse.executeMethod(
      controller.FAQController.add,
      req.body,
      req,
      res
    );
  }
);
//2. filter
router.get("/filter", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    controller.FAQController.filter,
    payload,
    req,
    res
  );
});

//3.view all FAQ

router.get(
  "/view",
  (req, res) => {
    return sendResponse.executeMethod(
      controller.FAQController.viewFaq,
      req.body,
      req,
      res
    );
  }
);

//4. admin edit the details
  router.put(
    "/edit",
    (req, res) => {
      return sendResponse.executeMethod(
        controller.FAQController.editFaq,
        req.body,
        req,
        res
      );
    }
  );
//5.Delete FAQ
router.delete(
  "/delete",
  (req, res) => {
    return sendResponse.executeMethod(
      controller.FAQController.deleteFaq,
      req.body,
      req,
      res
    );
  }
);

module.exports = router;
