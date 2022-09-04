const Model=require("../model")
const { Op } = require("sequelize");

exports.Add=(data)=>{
   return Model.AdminAchivementSecondLin.create(data)
}
exports.get = (data) => {
   return new Promise((resolve, reject) => {
     Model.AdminAchivementSecondLin.findOne({
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
     Model.AdminAchivementSecondLin.destroy({
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
     Model.AdminAchivementSecondLin.update(
       {
         name:d.name,
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