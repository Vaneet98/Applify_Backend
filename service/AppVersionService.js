const Model = require("../model");
const { Op } = require("sequelize");


exports.add = (data) => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.get = () => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.findAll()
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
    Model.AppVersion.findOne({
      where: { AppId: data.AppId },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.filter = (criteria, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy
        ? criteria.sortBy
        : "createdAt" ||
          "AppName" ||
          "plateform" ||
          "minimumVersion" ||
          "latestVersion",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        AppName: {
          [Op.like]: "%" + criteria.search + "%",
        },
        plateform: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  if (criteria && criteria.plateform) {
    where.plateform = criteria.plateform;
  }
  where.deletedTime = null;
  return new Promise((resolve, reject) => {
    Model.AppVersion.findAndCountAll({
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
exports.delete = (data) => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.destroy({
      where: { AppId: data.AppId },
    })
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
    Model.AppVersion.findOne({
      where: { AppId: data.AppId },
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
    Model.AppVersion.update(
      {
        latestVersion: data.latestVersion,
      },
      {
        where: { AppId: data.AppId },
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
    Model.AppVersion.findAndCountAll({
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findWeb = (data) => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.findAndCountAll({
   where:{plateform:"Web"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findandroid = (data) => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.findAndCountAll({
   where:{plateform:"Android"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.findIOS = (data) => {
  return new Promise((resolve, reject) => {
    Model.AppVersion.findAndCountAll({
   where:{plateform:"IOS"}
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};