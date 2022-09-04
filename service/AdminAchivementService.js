 const Model=require("../model")
 const { Op } = require("sequelize");

 exports.Add=(data)=>{
    return Model.AdminAchivement.create(data)
 } 

 Model.AdminAchivement.hasMany(Model.AdminAchivementSecondLin, { foreignKey: "achivementId" });
 Model.AdminAchivementSecondLin.belongsTo(Model.AdminAchivement, { foreignKey: "achivementId" });

 exports.getAllAdminsAchivement = (criteria, limit, offset) => {
    let where = {};
    let order = [
      [
        criteria.sortBy ? criteria.sortBy : "createdAt"||"name"||"Type",
        criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
      ],
    ];
    if (criteria && criteria.search) {
      where = {
        [Op.or]: {
          name: {
            [Op.like]: "%" + criteria.search + "%",
          },
          Type: {
            [Op.like]: "%" + criteria.search + "%",
          },
        }
      };
    }
    if (criteria && criteria.Type) {
      where.Type = criteria.Type;
    }
    if (criteria && criteria.name) {
        where.name = criteria.name;
      }
    where.destroyTime = null;
   
    if(criteria&&criteria.search){
       attributes=["Id","name","achivementId"]
    }
    else{
       attributes={exclude:["name","Id","achivementId","createdAt","updatedAt","destroyTime"]}
    }
    return new Promise((resolve, reject) => {
      Model.AdminAchivement.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: Model.AdminAchivementSecondLin,
            attributes:attributes
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
  exports.get = (data) => {
    return new Promise((resolve, reject) => {
      Model.AdminAchivement.findOne({
        where: { Id: data.Id },
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("getAll err ==>>  ", error);
        });
    });
  }
  
  exports.deleteAchivement = (data) => {
    return new Promise((resolve, reject) => {
      Model.AdminAchivement.destroy({
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
  exports.edit = (d) => {
    return new Promise((resolve, reject) => {
      Model.AdminAchivement.update(
        {
          name:d.name,
          Type:d.Type
        },
        {
          where: { Id: d.Id },
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