const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
module.exports ={
    add:async(d,req,res)=>{
        let data={
            AppName: req.body.AppName,
            plateform:req.body.plateform,
            minimumVersion:req.body.minimumVersion,
            latestVersion:req.body.latestVersion
        }
        if(data.minimumVersion< data.latestVersion){
            let user= await Service.AppVersionService.add(data)
            return user;
        }
      return {
        msg:"Enter latestVersion greater than minimum version"
      }
    },
    get:async()=>{
        let data= await Service.AppVersionService.get()
        return data;
    },
    filter:async(payloadData,req,res)=>{
        const schema = Joi.object().keys({
            limit: Joi.number().required(),
            skip: Joi.number().required(),
            sortBy: Joi.string().optional(),
            orderBy: Joi.string().optional(),
            search: Joi.string().optional().allow(""),
            plateform:Joi.string()
          });
          let payload = await Helper.verifyjoiSchema(payloadData, schema);
        let app=await Service.AppVersionService.filter(payload,parseInt(payload.limit, 10) || 10,
        parseInt(payload.skip, 10) || 0)
        return app;
    },
    delete:async(d,req,res)=>{
        let data={ 
            AppId: d.AppId
        }
   
        let app= await Service.AppVersionService.delete(data)
        return app;
    },
    edit:async(d,req,res)=>{
        let data={
            AppId:req.params.id,
            latestVersion:req.body.latestVersion
        }
            let app= await Service.AppVersionService.edit(data)
            return {
                status:200,
                message:"App version Edit successfully",
                app:app
            };
       
    }
} 