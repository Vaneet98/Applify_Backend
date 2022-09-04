const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
module.exports = {
  Add: async (d, req, res) => {
    let data = {
      name: req.body.name,
      achivementId: req.body.achivementId,
    };
    let user = await Service.AchivementLinkService.Add(data);
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
  edit: async (d) => {
    let data = {
      Id: d.Id,
      name: d.name,
    };
    let user = await Service.AchivementLinkService.get(data);
    if (user) {
      let user = await Service.AchivementLinkService.edit(data);
      return {
        status: "Success",
        message: "Sucessfull edit the admin Achivement",
      };
    }

    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
  deleteAchivement: async (data) => {
    const datas = {
      Id: data.Id,
    };
    let users = await Service.AchivementLinkService.get(datas);
    if (users) {
      let user = await Service.AchivementLinkService.deleteAchivement(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the achivement",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
    };
  },
};
