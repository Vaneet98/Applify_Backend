const Model = require("../model");
const { Op } = require("sequelize");
const { update } = require("./categoryService");

exports.Add = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getAllReported = (criteria, limit, offset) => {
  let where = {};
  // let order = [
  //   [
  //     // criteria.sortBy
  //     //   ? criteria.sortBy
  //     //   : "POST"||"COMMENT",
  //     criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
  //   ],
  // ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        ReportedBy: {
          [Op.like]: "%" + criteria.search + "%",
        },
        ReportedItem: {
          [Op.like]: "%" + criteria.search + "%",
        },
      }, 
    };
  }
  where.destroyTime = null;
  if (criteria["Status"] === "pending") where.Status = "pending";
  if (criteria["Status"] === "approved") where.Status = "approved";
  if (criteria["Status"] === "declined") where.Status = "declined";
  return new Promise((resolve, reject) => {
    Model.ReportContent.findAndCountAll({
      limit,
      offset,
      where: where,
      // order: order,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
}; 

exports.edit = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.update(
      {
        Status: data.Status,
        Description: data.Description,
      },
      {
        where: { Id: data.Id },
      }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findAll = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.findAndCountAll({
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findPending = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.findAndCountAll({
      where:{Status:"pending"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findApproved = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.findAndCountAll({
      where:{Status:"approved"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findDeclined = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportContent.findAndCountAll({
      where:{Status:"declined"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};