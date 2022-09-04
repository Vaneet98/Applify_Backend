const Model = require("../model");
 
exports.add = (data) => {
  return new Promise((resolve,reject)=>{
    Model.Notification.create(data) .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};
exports.findblocked = () => {
  return new Promise((resolve,reject)=>{
    Model.Notification.findAndCountAll({
      where: { destroyTime: null },
      attributes: { exclude: ["password", "deleted"] },
    }) .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

 
Model.AdminRegister.hasMany(Model.Notification, { foreignKey: "userId" });
Model.Notification.belongsTo(Model.AdminRegister, { foreignKey: "userId" });
//view all
exports.view =(criteria, projection, limit, offset) => {

  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt"||"userType",
      criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
        name: {
          [Op.like]: "%" + criteria.search + "%",
        },
      }
  };
  where.destroyTime = null;
  if (criteria["userType"] === "IOS") where.userType = "IOS";
  if (criteria["userType"] === "Android ") where.userType = "Android ";
  return new Promise((resolve, reject) => {
    Model.Notification.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Model.AdminRegister,
          attributes: ["name", "email"],
        },
      ],
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

//Edit the user
exports.edit = (data) => {
  return new Promise((resolve,reject)=>{
    Model.Notification.update(
    {
      notification: data.notification,
      userType: data.userType
    },
    {
      where: { notificationId: data.notificationId },
    }
  ) .then((result) => {
    resolve(result);
  })
  .catch((error) => {
    console.log("getAll err ==>>  ", error);
  });
  })
}
//delete a person
exports.deleteperson = (data) => {
  return new Promise((resolve,reject)=>{
    Model.Notification.destroy({
      where: { notificationId: data.notificationId },
    }) .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};