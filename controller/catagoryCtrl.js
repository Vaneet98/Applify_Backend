const Services = require("../service");
const Joi = require("joi");
const Helper = require("../helper/validator");
const path = require("path");
const multer = require("multer");
let categoryProjection = ["cId", "name", "image", "createdAt"];
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
  addCategory: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    let data = await Helper.verifyjoiSchema(datas, schema);
    if (!data) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let categoryData = {
        name: data.name,
        image: req.file.path,
      };
        const category = await Services.categoryService.findCategory(categoryData);
        if (category) {
          return " category already exists";
        } else {
          let newData = {
            name: categoryData.name,
            image: categoryData.image,
          };
          let add = await Services.categoryService.addCategory(newData);
          return {
            status: "success",
            msg: "Category added successfully.",
            category: add,
          };
        }
      
    }
  },

  deleteCategory: async (d,req, res) => {
    const obj = {
      cId: d.cId,
    }; 
   
    const deleteCat = await Services.categoryService.deleteCategory(obj);
    return{ message: "Deletion successfull", details: deleteCat }
  },
  //-------- to find all the categories ------
  getAllCategories: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    let category = await Services.categoryService.getAllCategories(
      payload,
      categoryProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (category) {
      return category;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  
   list: async (datas,req,res) => {
    let data={
      cId:req.params.cId
    }
    const user = await Services.categoryService.find(data);
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
  //--------  update category -----
  updateCategory: async (d,req, res) => {
    const data = {
      cId: req.body.cId,
      name: req.body.name,
    };
    const category = await Services.categoryService.find(data);
    if (category && req.user.role === 1) {
      const newdata = {
        name: data.name,
        cId: data.cId,
      };
      const updateData = await Services.categoryService.update(newdata);
      res
        .status(200)
        .json({ message: "Updation Successfull.", data: updateData });
    } else {
      res.status(400).json({ message: "Updation Un-successfull." });
    }
  },
  upload
};