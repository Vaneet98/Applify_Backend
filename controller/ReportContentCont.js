const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");

var moment = require("moment");

module.exports = {
  Add: async (d, req, res) => {
    let data = {
      ReportedBy: req.body.ReportedBy,
      ReportedItem: req.body.ReportedItem,
      Status: req.body.Status,
      Description: req.body.Description,
      Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    };
    let user = await Service.ReportContentService.Add(data);
    if (user) {
      return {
        message: "Add successfull",
        user: user,
      };
    } else {
      return {
        message: "Something worng",
      }; 
    }
  },
  getAllReported: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      ReportedBy: Joi.string().optional(),
      ReportedItem: Joi.string(),
      Status: Joi.string(),
      Description: Joi.string(),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    let admins = await Service.ReportContentService.getAllReported(
      payload,

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

  edit: async (data, req) => {
    const datas = {
      Id: req.body.Id,
      Status: req.body.Status,
      Description: req.body.Description,
    };
    console.log(datas);
    let user = await Service.ReportContentService.edit(datas);
    if (user) {
      return {
        status: "Success",
        message: "Sucessfull edit the status and Description",
      };
    }
    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
};
