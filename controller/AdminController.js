const _ = require("underscore");
const Service = require("../service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const transporter = require("../config/emailConfig");
const nodemailer = require("nodemailer");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
const otpGenerator = require("otp-generator");
const path = require("path");
const multer = require("multer");
// var session = require('express-session');
let adminProjection = [
  "adminId",
  "name",
  "email",
  "title",
  "Isblocked",
  "createdAt",
];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give a proper file format to upload.");
  },
});
module.exports = { 
  Registration: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      title: Joi.string(),
      image: Joi.string(),
      RegistrationPermission: Joi.number().integer(),
      BlockedPermission: Joi.number().integer(),
      UnblockedPermission: Joi.number().integer(),
      DeletedPermission: Joi.number().integer(),
      EditPermission: Joi.number().integer(),
    });
    let payload = await Helper.verifyjoiSchema(datas, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let adminData = {
        email: payload.email,
      };
      const admin = await Service.AdminService.getAdmins(adminData);

      if (admin) {
        return { status: "failed", message: "Email already exist" };
      } else {
        if (payload.email && payload.password) {
          // try {
            var value = payload.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(value, salt);
            let objToSave = {};
            //The _.has() function is used to check whether the given object contains the given key or not
            if (_.has(payload, "name") && payload.name !== "")
              objToSave.name = payload.name;
            if (_.has(payload, "title") && payload.title !== "")
              objToSave.title = payload.title;
            if (_.has(payload, "email") && payload.email !== "")
              objToSave.email = payload.email;
            if (_.has(payload, "password") && payload.password !== "")
              objToSave.password = hashPassword;
            if (
              _.has(payload, "RegistrationPermission") &&
              payload.RegistrationPermission !== ""
            )
              objToSave.RegistrationPermission = payload.RegistrationPermission;
            if (
              _.has(payload, "UnblockedPermission") &&
              payload.UnblockedPermission !== ""
            )
              objToSave.UnblockedPermission = payload.UnblockedPermission;
            if (
              _.has(payload, "DeletedPermission") &&
              payload.DeletedPermission !== ""
            )
              objToSave.DeletedPermission = payload.DeletedPermission;
            if (
              _.has(payload, "EditPermission") &&
              payload.EditPermission !== ""
            )
              objToSave.EditPermission = payload.EditPermission;
            // objToSave.image = req.file.path;

            let admin = await Service.AdminService.addAdmin(objToSave);
            // let info = await transporter.sendMail({
            //   from: process.env.EMAIL_FROM,
            //   to: data.email,
            //   subject: "Registration successfull",
            //   html: `<p>Hi <b>${data.name}</b>, Thank you for registering with <b>Applify</b></p>`,
            // });
            return {
              status: "Success",
              message: "Registeration successfull",
            };
          // } catch (error) {
          //   return { status: "failed", message: "Unable to register" };
          // }
        } else {
          return { status: "failed", message: "All fields are required" };
        }
      }
    }
  },
  loginAdmin: async (datas,req,res) => {
    // try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      let data = await Helper.verifyjoiSchema(datas, schema);

      if (!data) {
        return { status: "failed", message: "Invalid strings types" };
      }
      const admindata = {
        email: data.email,
        password: data.password,
      };
      const user = await Service.AdminService.getAdmins(admindata);
      if (user.Isblocked === 1) {
        return { status: 404, message: "You are blocked " };
      }
      if (data.email && data.password) {
        const useremail = await Service.AdminService.getAdmins(admindata);

        if (useremail != null) {
          const isMatch = await bcrypt.compare(
            data.password,
            useremail.password
          );
          if (useremail.email && isMatch) {
            //Genterate token
            const token = jwt.sign(
              {
                adminId: useremail.adminId,
                title: useremail.title,
                RegistrationPermission: useremail.RegistrationPermission,
                BlockedPermission: useremail.BlockedPermission,
                UnblockedPermission: useremail.UnblockedPermission,
                DeletedPermission: useremail.DeletedPermission,
                EditPermission: useremail.EditPermission,
              },
              process.env.JWT_SECRET_KEY,

              {
                expiresIn: "15m",
              }
            );
          // Put token into cookie
           res.cookie("token", token, { expire: new Date() + 9999 });
            return {
              status: "Success",
              message: "Login success",
              token: token,
              adminId: useremail.adminId,
              userdetails: user
            };
          } else {
            return {
              status: "failed",
              message: "Email or Password is not Valid",
            };
          }
        } else {
          return { status: "failed", message: "You are not Registered User" };
        }
      } else {
        return { status: "failed", message: "All fields are required" };
      }
    // } catch (error) {
    //   return { status: "failed", message: "Unabale to login" };
    // }
  },
  deleteperson: async (data) => {
    const datas = {
      adminId: data.adminId,
    };
    let users = await Service.AdminService.get(datas);
    if (users) {
      let user = await Service.AdminService.deleteperson(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      user: user,
    };
  },
  blockAndUnblock: async (d) => {
    let data = {
      adminId: d.adminId,
    };
    let user = await Service.AdminService.get(data);
    if (user.Isblocked===0) {
      let user = await Service.AdminService.blockperson(data);
      return {
        status: 200,
        message: "Sucessfull block the user",
        user:user.Isblocked
      };
    }
    else{
    let user = await Service.AdminService.unblockperson(data);
    return {
      status: 201,
      message: "Sucessfull unblock the user",
      user:user.Isblocked
    };
   }
  },
  changeUserPassword: async (data, req, res) => {
    const { email, old_password, new_password, confirmPassword } = data;
    let criteria = { email: email };

    let admin = await Service.AdminService.getadminDetail(criteria);
    const isMatch = bcrypt.compare(old_password, admin.password);
    if (isMatch || new_password === confirmPassword) {
      var value = new_password;
      const salt = await bcrypt.genSalt(10);
      const newhashPassword = await bcrypt.hash(value, salt);

      await Service.AdminService.updatepassword(email, newhashPassword);

      return { status: "Success", message: "Password change successfull" };
    }
  },
  loggedOut: async (data, req, res) => {
    // req.session.destroy();
    res.clearCookie("token"); // Clear the cookier whose name is Token
    return { status: "Success", message: "Logged Out successfull" };
  },
  edit: async (d) => {
    let data = {
      adminId: d.adminId,
      RegistrationPermission: d.RegistrationPermission,
      BlockedPermission: d.BlockedPermission,
      UnblockedPermission: d.UnblockedPermission,
      DeletedPermission: d.DeletedPermission,
      EditPermission: d.EditPermission,
    };
    let user = await Service.AdminService.get(data);
    if (user) {
      let user = await Service.AdminService.edit(data);
      return {
        status: "Success",
        message: "Sucessfull edit the user",
      };
    }

    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
  addAdmin: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      title: Joi.string(),
    });
    let data = await Helper.verifyjoiSchema(datas, schema);
    if (!data) {
      return {message:"Invalid types"};
    } else {
      let userData = {
        name: data.name,
        email: data.email,
        title: data.title,
      };
      const user = await Service.AdminService.getAdmins(userData);
      if (user) {
        return "already exists";
      } else {
        const addUser = await Service.AdminService.addAdmin(userData);
        const token = jwt.sign({ adminId: addUser.adminId}, process.env.JWT_SECRET_KEY, {
          expiresIn: "4d",
        });
        var transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
          },
        });

        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: data.email,
          subject: "Password Reset link",
          html: `<h3>
          You have been added as an Admin, please set your password by following the link below.
            Click on the <a href="http://localhost:3000/reset/${token}">
              link
            </a>
            to reset your password
          </h3>`,
        });
        return {
          status: "success",
          msg: "registered",
          user: addUser,
          token: token,
          info: info,
        };
      }
    }
  },
  sendEmailForForgetPassword: async (data, req, res) => {
    const email = { email: data.email };

    if (email) {
      const user = await Service.AdminService.getAdmins(email);

      if (user) { 
        const secret = user.adminId + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ adminId: user.adminId }, secret, {
          expiresIn: "15m",
        });
        // --- create frontend link ----
        const link = `http://127.0.0.1:3000/reset/${token}`;
        //-- But in ReactJS link link it /reset/:token---

        var transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
          },
        });
        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Password Set link",
          html: `<a href=${link}>Click here</a> to Set your password`,
        });
        return {
          status: "Success",
          message: "Password Set Email send....Please check the email",
          info: "info",
        };
      } else {
        return { status: "failed", message: "Email doesn't exists" };
      }
    } else {
      return { status: "failed", message: "Email field is Required" };
    }
  },
  setpassword: async (data, req, res) => {
    const { email, password, confirmPassword } = data;
    let criteria = { email: email };

    let admin = await Service.AdminService.getadminDetail(criteria);
    
    if (password === confirmPassword) {
      var value = password;
      const salt = await bcrypt.genSalt(10);
      const newhashPassword = await bcrypt.hash(value, salt);

      await Service.AdminService.updatepassword(email, newhashPassword);

      return { status: "Success", message: "Set Paassword successfull" };
    }
  } ,
  editAdminDetails: async (datas, req, res) => {
    let data = { 
      // email: datas.email,
      adminId:req.params.adminId,
      name: datas.name,
      title:datas.title  
    };
      let update = await Service.AdminService.updateData(data);
      if(update){
        return { status: "data updated successfully", message: "success",update:update };
      }
     else {
      return { status: "failed", message: "Something is wrong" }; 
    }
  },
  getAllAdmins: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      title: Joi.string().optional().allow(""),
      Isblocked: Joi.number().optional(),
      name: Joi.string().optional(),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    let admins = await Service.AdminService.getAllAdmins(
      payload,
      adminProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (admins) {
      return admins;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  getAllDetails:async(data)=>{
    //1. Admin total count, blocked, unblocked
  const admin=await Service.AdminService.getCount();
  const count=admin.count;
  const block=await Service.AdminService.getBlock();
  const Block=block.count;
  const Unblock=await Service.AdminService.getUnBlock();
  const UnBlock=Unblock.count
  //2. App version count, web, android, ios
  const appVersion=await Service.AppVersionService.findAll();
  const AppTotal=appVersion.count
  const web=await Service.AppVersionService.findWeb();
  const Web=web.count;
  const android=await Service.AppVersionService.findandroid();
  const Android=android.count;
  const ios=await Service.AppVersionService.findIOS();
  const IOS=ios.count;
  //3. Report Content total,pending,declined,approved
  const ReportTotal=await Service.ReportContentService.findAll()
  const Report=ReportTotal.count;
  const ReportPending=await Service.ReportContentService.findPending()
  const Pending=ReportPending.count;
  const ReportApproved=await Service.ReportContentService.findApproved()
  const Approved=ReportApproved.count;
  const ReportDeclined=await Service.ReportContentService.findDeclined()
  const Declined=ReportDeclined.count;
  //4. Report Bug total,pending,declined,approved
  const Bugtotal=await Service.ReportBugService.findAll()
  const BugTotal=Bugtotal.count;
  const Bugpending=await Service.ReportBugService.findpending()
  const BugPendng=Bugpending.count;
  const Bugapproved=await Service.ReportBugService.findapproved()
  const BugApproved=Bugapproved.count;
  const Bugdeclined=await Service.ReportBugService.finddeclined()
  const BugDeclined=Bugdeclined.count;
  return{ count:count,Block:Block,UnBlock:UnBlock,AppTotal:AppTotal,Web:Web,Android:Android,IOS:IOS,ReportTotal:Report,Pending:Pending,Approved:Approved,Declined:Declined,BugTotal:BugTotal,BugPendng
  :BugPendng,BugApproved:BugApproved,BugDeclined:BugDeclined}
  },
  editAdminProfile: async (payload, req, res) => {
    let data = {
      email: payload.email,
      name: payload.name,
      image: req.file.path,
    };
    const edit = await Service.AdminService.editAdminProfile(data);
    if (edit) {
      return {
        status: "success",
        message: "successfully edited",
        edit: edit,
      };
    } else {
      return {
        status: "failed",
        message: "somethings wrong",
      };
    }
  },
  upload,
}; 
 