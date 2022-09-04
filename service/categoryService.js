const { Op } = require("sequelize");
const Models = require("../model");

//------------- Filter Categories ---------------
exports.getAllCategories = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "name" || "createdAt" || "image",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        name: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  where.deletedTime = null;
  return new Promise((resolve, reject) => {
    Models.category
      .findAndCountAll({
        limit,
        offset,
        where: where,
        attributes: projection,
        order: order,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};

exports.findCategory = (data) => {
  return new Promise((resolve, reject) => {
    Models.category
      .findOne({
        where: {
          name: data.name,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};
exports.addCategory = (data) => {
  return new Promise((resolve, reject) => {
    Models.category
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};

exports.deleteCategory = (obj) => {
  return new Promise((resolve, reject) => {
    Models.category
      .destroy({
        where: { cId: obj.cId },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};

//--------- update category ------------
exports.update = (newdata) => {
  return new Promise((resolve, reject) => {
    Models.category
      .update(
        {
          name: newdata.name,
        },
        {
          where: {
            cId: newdata.cId,
          },
        }
      )
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};

exports.find = (data) => {
  return new Promise((resolve, reject) => {
    Models.category
      .findOne({
        where: {
          cId: data.cId,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};
