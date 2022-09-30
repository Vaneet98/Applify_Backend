const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controller/userController");
const sendRespose = require("../helper/sendResponse");

const isAuth = require("../middleware/IsAuth");

// REGISTERATION 
router.post("/registration", (req, res) => {
  return sendRespose.executeMethod(
    userController.registration,
    req.body,
    req,
    res
  );
});

router.put("/updateUser", isAuth, (req, res) => {
  return sendRespose.executeMethod(
    userController.updateUser,
    req.body,
    req,
    res
  );
});

router.post("/login", (req, res) => {
  return sendRespose.executeMethod(userController.login, req.body, req, res);
});

// DASHBOARD
router.get("/countuserByPhoneNumber", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByPhoneNumber,
    req.body,
    req,
    res
  );
});

router.get("/countuserByEmail", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByEmail,
    req.body,
    req,
    res
  );
});

//Get specific user detail using id
router.get("/list/:id", (req, res) => {
  return sendRespose.executeMethod(
    userController.list,
    req.body,
    req,
    res
  );
});

router.get("/getUserBygoogleId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserBygoogleId,
    req.body,
    req,
    res
  );
});

router.get("/getUserByFacebookId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserByFacebookId,
    req.body,
    req,
    res
  );
});


router.get("/changePassword", (req, res) => {
  return sendRespose.executeMethod(
    userController.changePassword,
    req.body,
    req,
    res
  );
});

// FOR SOCIAL LOGIN - Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
  (req, res) => {
    res.send("Hello Facebook");
  }
);
//Registraiton by facebook
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    return sendRespose.executeMethod(
      userController.registrationByFacebook,
      req.body,
      req,
      res
    );
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

// FOR SOCIAL LOGIN - Google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("Hello Google!!");
  }
);
//Registration by google
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  return sendRespose.executeMethod(
    userController.registrationByGoogle,
    req.body,
    req,
    res
  );
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("User logged out successfully!!");
  });
});

//Delete user
router.delete("/delete/:id", (req, res) => {
  return sendRespose.executeMethod(
    userController.deleteUser, 
    req.params,
    req,
    res
  );
});

//edit user
router.put("/edit/:id", (req, res) => {
  return sendRespose.executeMethod(
    userController.editUser, 
    req.body,
    req,
    res
  );
});

//Block the user
router.put("/block/:id",  (req, res) => {
  return sendRespose.executeMethod(
    userController.block,
    req.params,
    req,
    res
  );
});
module.exports = router;
