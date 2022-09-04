const Service = require("../service");
 
module.exports = {
  add: async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      FAQ: req.body.FAQ,
      status: req.body.status,
    };
    const user = await Service.FAQService.add(data);
    return user;
  },
 
  filter:async(payload,req,res)=>{
    
      let user= await Service.FAQService.filtersolved(payload)
      return user;
  },
  viewFaq: async () => {
   
    let user = await Service.FAQService.viewFaq();
    if (user) {
      return user;
    } else {
      return { status: "failed", message: "No user present" };
    }
  },
  deleteFaq: async (data) => {
    const datas = {
      Faqid: data.Faqid,
    };
    let users = await Service.FAQService.get(datas);
    if (users) {
      let user = await Service.FAQService.deleteFaq(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the FAQ",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      user: user,
    };
  },
  editFaq: async (req,res) => {
    let data = {
      Faqid: req.body.Faqid,
    };
    let user = await Service.FAQService.get(data);
    if (user) {
      let user = await Service.FAQService.edit(data);
      return {
        status: "Success",
        message: "Sucessfull edit the FAQ",
      };
    }

    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
};
