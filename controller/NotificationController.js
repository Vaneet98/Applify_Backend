const Helper = require("../helper/validator.js");
const Joi = require("joi");
const Service = require("../service");
const path = require("path");
const multer = require("multer");
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
  addNotification: async (D,req, res) => {
    const schema = Joi.object({
      notification: Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
      userType: Joi.string().required(),
    });
    let payload = await Helper.verifyjoiSchema(D, schema);
    if (!payload) {
      return { status: 401, message: "Invalid strings types" };
    }
    else{
      const data = {
        userId: req.body.userId,
        notification: req.body.notification,
        userType: req.body.userType,
        image:req.file.path
      };
      let findData = await Service.NotificationService.add(data);
      try {
        if (findData) {
          return{ status:200,message: "New Notification added" }
        }
      } catch (error) {
       return { status:201,message: "Something went wrong OR can not add notification",
       err: error,}
      }
    }
   
  },
  viewAll: async (payload) => {
    let user = await Service.NotificationService.view(payload);
    return user;
  },
  edit: async (data,req,res) => {
    const schema = Joi.object({
      notification: Joi.string().required(),
      userType: Joi.string().required(),
    });
    let payload = await Helper.verifyjoiSchema(data, schema);
    if (!payload) {
      return { status: 401, message: "Invalid strings types" };
    }
    else{
      const datas = {
        notificationId: req.params.notificationId,
        notification:payload.notification,
        userType: payload.userType,
      }; 
      console.log(datas)
    
      
        let user = await Service.NotificationService.edit(datas);
        if(user){
          return {
            status: 200,
            message: "Sucessfull edit the user",
          };
        }
      return {
        status: 201,
        message: "Not able to edit the user because user not register",
      };
    }
  
  },
   list: async (datas,req,res) => {
    let data={
      notificationId:req.params.notificationId
    }
    const user = await Service.NotificationService.findUserById(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  deleteperson: async (data) => {
    const datas = {
      notificationId: data.notificationId,
    };
  
      let user = await Service.NotificationService.deleteperson(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      }
   
  },upload
}; 