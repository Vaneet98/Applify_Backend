const Model = require("../model");
const { Op } = require("sequelize");
const { update } = require("./categoryService");

exports.Add = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportedBugModel.create(data)
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
  let order = [
    [
      criteria.sortBy
        ? criteria.sortBy
        : "POST"||"COMMENT",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
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
    Model.ReportedBugModel.findAndCountAll({
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
    Model.ReportedBugModel.update(
      {
        Status: data.Status,
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

exports.find = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportedBugModel.findOne({
      where: { Id: data.Id },
    })
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
    Model.ReportedBugModel.findAndCountAll({
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findpending = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportedBugModel.findAndCountAll({
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
exports.findapproved = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportedBugModel.findAndCountAll({
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
exports.finddeclined = (data) => {
  return new Promise((resolve, reject) => {
    Model.ReportedBugModel.findAndCountAll({
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