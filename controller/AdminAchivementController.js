const Service = require("../service");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
module.exports={
Add:async(d,req,res)=>{
  const schema = Joi.object().keys({
    name:Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
    Type:Joi.string().required()
  });
  let payload = await Helper.verifyjoiSchema(d, schema);
  if(!payload){
    return {status:400,message:"Invalid Type"}
  }else{
    let data={
      name:req.body.name,
      Type:req.body.Type
  }
  let user= await Service.AdminAchivementService.Add(data)
if(user){
  return {
    status:200,
      message:"Add successfull",
      user:user
  }
}
else{ 
  return {
    status:401,
      message:"Something worng"
  }
}
  }
       
    },
getAllAdminsAchivement: async (payloadData) => {
        const schema = Joi.object().keys({
          limit: Joi.number().required(),
          skip: Joi.number().required(),
          sortBy: Joi.string().optional(),
          orderBy: Joi.string().optional(),
          search: Joi.string().optional().allow(""),
          name:Joi.string(),
          Type:Joi.string()
        });
        let payload = await Helper.verifyjoiSchema(payloadData, schema);
        let admins = await Service.AdminAchivementService.getAllAdminsAchivement(
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
edit: async (d,req,res) => {
  const schema = Joi.object().keys({
    name:Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
    Type:Joi.string().required()
  });
  let payload = await Helper.verifyjoiSchema(d, schema);
  if(!payload){
    return{ status:400,message:"Invalid Type"}
  }
  else{
    let data = {
      Id: req.params.Id,
      name:d.name, 
      Type:d.Type
    };
    
      let user = await Service.AdminAchivementService.edit(data);
      return {
        status: 200,
        message: "Sucessfull edit the admin Achivement",
      };
  }
     
      },     
deleteAchivement: async (data,req,res) => {
        const datas = {
          Id: req.params.Id,
        };
        // let users = await Service.AdminAchivementService.get(datas);
        // if (users) {
          let user = await Service.AdminAchivementService.deleteAchivement(datas);
          return {
            status: "Success",
            message: "Sucessfull delete the achivement",
            user: user,
          };
        // }
        // return {
        //   status: "falied",
        //   message: "User not register",
        
        // };
      },
      list:async(d,req,res)=>{
        let data={
            Id:req.params.Id
          }
          const user = await Service.AdminAchivementService.get(data);
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
}