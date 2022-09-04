const express = require("express");
const controller = require("../controller");
const IsAuth= require("../middleware/IsAuth.js")
const router = express.Router()
const Middleware= require("../middleware/Middleware.js")
const sendResponse=require("../helper/sendResponse")
//----- add all the categories-------
  router.post(
   "/addVersion",
   (req, res) => {
     return sendResponse.executeMethod(
      controller.AppVersionController.add,
       req.body,
       req,
       res
     );
   }
 );

 //Get the all detail
 router.get(
   "/getVersion",
   (req, res) => {
     return sendResponse.executeMethod(
      controller.AppVersionController.get,
       req.body,
       req,
       res
     );
   }
 );
 
 //Get the all detail
 router.get("/filterVersion", (req, res) => {
   let payload = req.query;
   if (payload.skip && payload.limit && payload.skip > 0) {
     payload.skip = (payload.skip - 1) * payload.limit;
   }
   return sendResponse.executeMethod(
      controller.AppVersionController.filter,
     payload,
     req,
     res
   );
 });
 

 //delete  the version  ,IsAuth,Middleware.DeletePermis,
 router.delete(
   "/delete/:AppId",
   (req, res) => {
     return sendResponse.executeMethod(
      controller.AppVersionController.delete,
       req.params,
       req,
       res
     ); 
   }
 );
 
 //router edit latest version  IsAuth,Middleware.EditPermis,
 router.put(
   "/edit/:id",
   (req, res) => {
     return sendResponse.executeMethod(
      controller.AppVersionController.edit,
       req.body,
       req,
       res
     );
   }
 );

module.exports = router;
