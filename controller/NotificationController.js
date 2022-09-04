
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
    const data = {
      userId: req.body.userId,
      notification: req.body.notification,
      userType: req.body.userType,
      image:req.file.path
    };
    let findData = await Service.NotificationService.add(data);
    try {
      if (findData) {
        return{ msg: "New Notification added" }
      }
    } catch (error) {
     return { msg: "Something went wrong OR can not add notification",
     err: error,}
    }
  },
  viewAll: async (payload) => {
    let user = await Service.NotificationService.view(payload);
    return user;
  },
  edit: async (data,req,res) => {
    const datas = {
      notificationId: req.params.notificationId,
      notification:data.notification,
      userType: data.userType,
    }; 
    console.log(datas)
  
    
      let user = await Service.NotificationService.edit(datas);
      if(user){
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