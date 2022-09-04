const Model = require("../model");
const { Op } = require("sequelize");

exports.addFeed = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
 
Model.AdminRegister.hasMany(Model.feedback, { foreignKey: "uId" });
Model.feedback.belongsTo(Model.AdminRegister, { foreignKey: "uId" });
 
exports.findFeed = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .findOne({
        include: [
          {
            model: Model.AdminRegister,
            attributes: ["name", "email"],
          },
        ],
        where: {
          id: data.id,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.findFeedBack = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .findOne({
        where: {
          [Op.and]: [{ id: data.id, uId: data.adminId }],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.deleteFeed = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .destroy({
        where: {
          [Op.and]: [{ id: data.id, uId: data.adminId }],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getratting = (criteria) => {
  console.log(criteria);
  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt" || "comment" || "rating",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  return new Promise((resolve, reject) => {
    Model.feedback
      .findAndCountAll({
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
