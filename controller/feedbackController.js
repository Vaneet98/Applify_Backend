const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
module.exports = {
  createFeed: async (d,req, res) => {
    let data = {
      comment: req.body.comment,
      rating: req.body.rating,
      uId: req.body.uId, 
    };
    const create = await Service.feedbackService.addFeed(data);
    try {
      if (create) {
        return {
          msg: "FeedBack Added successfull",
          details: create 
        }
      }
    } catch (error) {
      return {
        msg:"Something Went Wrong"
      }
    }
  },
  getParticularFeedBack: async (d,req, res) => {
    let data = {
      id: req.params.id,
    };
    const getFeed = await Service.feedbackService.findFeed(data);
    try {
      if (getFeed) {
        return {
          msg: "success", data: getFeed 
        }
      }
    } catch (error) {
      return { msg: "Something went wrong", error: error }
    }
  },
  DeleteFeed: async (d,req, res) => {
    const obj = {
        adminId: req.body.adminId,
      id: req.body.id,
    };
    const get = await Service.feedbackService.findFeedBack(obj);

    if (get ) {
      const deleteFeed = await Service.feedbackService.deleteFeed(obj);
      res
        .status(200)
        .json({ message: "Deletion successfull", details: deleteFeed });
    } else {
      res
        .status(401)
        .send(
          "FeedBack not found, Access Denied Or You Are Not Autherized to delete."
        );
    }
  },
  getratting:async(payloadData,req,res)=>{
    const schema = Joi.object().keys({
      limit: Joi.number().required(),
      skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
    });
    let payload = await Helper.verifyjoiSchema(payloadData, schema);
    const gets=await Service.feedbackService.getratting(payload);
    return gets;
  }
} 