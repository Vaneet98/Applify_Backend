const express = require("express");
const Ctrl = require("../controller");
const IsAuth= require("../middleware/IsAuth.js")
const router = express.Router();
const sendResponse=require("../helper/sendResponse")
 

// category routes
//1 get all the categories
router.get("/list", (req, res) => {
  let payload = req.query;
  if (payload.skip && payload.limit && payload.skip > 0) {
    payload.skip = (payload.skip - 1) * payload.limit;
  }
  return sendResponse.executeMethod(
    Ctrl.catagoryCtrl.getAllCategories,
    payload,
    req,
    res
  );
});
 
//Get specific user detail using id
router.get("/list/:cId", (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.catagoryCtrl.list,
    req.body,
    req,
    res
  );
});

//2.Add categories
router.post("/addCategory",Ctrl.catagoryCtrl.upload.single("image"), (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.catagoryCtrl.addCategory,
    req.body,
    req,
    res
  );
});



//3. Delete category   ,IsAuth
router.delete("/deleteCategory/:cId", (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.catagoryCtrl.deleteCategory,
    req.params,
    req,
    res
  ); 
});


//4. update category
router.put("/update/Category",Ctrl.catagoryCtrl.upload.single("image"),IsAuth, (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.catagoryCtrl.updateCategory,
    req.body,
    req,
    res
  );
});

module.exports = router;