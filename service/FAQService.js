const Model = require("../model");
const { Op } = require("sequelize");
//1.Add
exports.add = (data) => {
  return new Promise((resolve,reject)=>{
    Model.FAQModel.create(data).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//2.Filter
exports.filtersolved = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt"||"name"||"email"||"FAQ"||"status",
      criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
    ],
  ];
  if (criteria && criteria.status) {
    where.status = criteria.status;
  }
  if (criteria && criteria.name) {
    where.name = criteria.name;
  }
  return new Promise((resolve, reject) => {
    Model.FAQModel.findAndCountAll({
      limit,
      offset,
      where: where,
      order: order,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//3.view specific person
exports.viewFaq = () => {
  return new Promise((resolve,reject)=>{
    Model.FAQModel.findAll({
    }).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};
//4. Get detail of FAQ
exports.get = (data) => {
  return new Promise((resolve,reject)=>{
    Model.FAQModel.findOne({
      where: { Faqid: data.Faqid },
    }).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//5.delete a person
exports.deleteFaq = (data) => {
  return new Promise((resolve,reject)=>{
    Model.FAQModel.destroy({
      where: { Faqid: data.Faqid },
    }).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//6.Edit the user
exports.edit = (d) => {
  return new Promise((resolve,reject)=>{
     Model.FAQModel.update(
    {
      status: "solved",
    },
    {
      where: { Faqid: d.Faqid },
    }
  ).then((result) => {
    resolve(result);
  })
  .catch((error) => {
    console.log("getAll err ==>>  ", error);
  });
  })
};
