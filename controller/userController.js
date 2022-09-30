require("dotenv").config();
const Service = require("../service");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
// FOR NODEMAILER
const nodemailer = require("nodemailer");
// For Social Login
const passport = require("passport");
const { findUserById } = require("../service/userService");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

var important_OTP;

module.exports = {
  registration: async (data) => {
    const schema = Joi.object({
      name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phoneNumber:Joi.number().integer().required(),
    });
    let payload = await Helper.verifyjoiSchema(data, schema);
    if (!payload) {
      return { status: "failed", message: "Invalid strings types" };
    }
    else{
       const userData = {
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        return {
          status: 400,
          message: "User already exists",
        };
      }
    }  else if (!userData.email || !userData.phoneNumber || !userData.password) {
      return {
        status: 400,
        message: "Please Enter Email & Password",
      };
    }
    try {
      const value = payload.password;
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(value, salt);

      let userData = {
        name: payload.name,
        email: payload.email,
        password: hashPassword,
        phoneNumber: payload.phoneNumber,
      };

      const user = await Service.userService.registration(userData);
      return {
        status: 200,
        message: "User registration successfully",
      };
    } catch (error) {
      return {
        status: 400,
        message: "Something went Wrong / Please enter Valid Details ",
      };
    }
    }
   
  },
  registrationByFacebook: async (data, req, res) => {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (id, done) {
      return done(null, id);
    });

    // Facebook Startegy
    passport.use(
      new FacebookStrategy(
        {
          // This will ask the token From Google
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_CLIENTSECRET,
          callbackURL:
            "http://localhost:8000/api/auth/facebook/callback" /* In this url google will attach the token and based on that token we will ask information  */,
        },
        async (token, refreshToken, profile, next) => {
          // Based on the token which google provided, we will ask Information
          console.log("PROFILE", profile);

          // SAVING User in the DB
          const userData = {
            id: profile.id,
          };

          console.log("ID is", userData);

          if (userData.id) {
            const user = await Service.userService.findUserByFacebookID(
              userData
            );

            if (user) {
              console.log("User alread exists in Database", user);
              next(null, user);
              return {
                status: 400,
                message: "User already exists in Database",
                data: user,
              };
            } else {
              let userData = {
                name: profile.displayName,
                facebookID: profile.id,
              };

              console.log("STORED DATA", userData);

              const user = await Service.userService.registration(userData);
              next(null, user);
              return {
                status: 200,
                message: "User registration successfully",
              };
            }
          }
        }
      )
    );
  },
  registrationByGoogle: async (data, req, res) => {
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      return done(null, id);
    });

    // Google Startegy
    passport.use(
      new GoogleStrategy(
        {
          // This will ask the token From Google
          clientID: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_CLIENTSECRET,
          callbackURL:
            "http://localhost:8000/api/google/callback" /* In this url google will attach the token and based on that token we will ask information  */,
          // profileFields: ["id", "displayName", "email"],
        },
        async (token, refreshToken, profile, next) => {
          // Based on the token which google provided, we will ask Information
          console.log("PROFILE", profile);

          //  SAVING User in the DB

          const userData = {
            email: profile._json.email,
          };

          if (userData.email) {
            const user = await Service.userService.findUserByEmail(userData);

            if (user) {
              console.log("User alread exists in Database", user);
              next(null, user);
              return {
                status: 400,
                message: "User already exists in Database",
                data: user,
              };
            } else {
              let userData = {
                name: profile.displayName,
                googleId: profile.id,
                email: profile._json.email,
              };

              console.log(userData);

              const user = await Service.userService.registration(userData);
              next(null, user);
              return {
                status: 200,
                message: "User registration successfully",
              };
            }
          }
        }
      )
    );
  },
  updateUser: async (data, req, res) => {
    const userData = {
      id: data.id,
      gender: data.gender,
      age: data.Age,
      address: data.Address,
    };
    console.log("USER DATA :", userData); /* User ka data frontend se */
    const user = await Service.userService.findUserById(userData);
    if (user) {
      if (req.user.id === userData.id) {
        const users = await Service.userService.updateUser(userData);
        console.log("USER", user); /* 1 */
        return {
          status: 200,
          message: "User Update successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            age: user.Age,
            address: user.Address,
          },
        };
      } else {
        return {
          status: 200,
          message: "User is not Authenticated",
        };
      }
    } else {
      return {
        status: 400,
        json: "User Does Not Exists",
      };
    }
  },
  login: async (data, req, res) => {
    const userData = {
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        if (data.email && data.password) {
          const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (user.email && passwordMatch) {
            // Generate Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
            console.log(token);

            // Put Token in the cookies
            res.cookie("token", token, { expire: new Date() + 9999 });

            return {
              status: 200,
              message: "User loggedIn successfully",
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                googleId: user.googleId,
                facebookID: user.facebookID,
              },
            };
          } else {
            return {
              status: 400,
              message: "UserName and Password Does Not match",
            };
          }
        }
      } else {
        return {
          status: 400,
          message: "User Does not exist in the database",
        };
      }
    } else if (userData.phoneNumber) {
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        if (data.phoneNumber && data.password) {
          const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (user.phoneNumber && passwordMatch) {
            // Generate Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
            console.log(token);

            // Put Token in the cookies
            res.cookie("token", token, { expire: new Date() + 9999 });

            /* TODO: NEED TO SEND MESSAGE (after phoneNumber and Message, need to verify) */

            return {
              status: 200,
              message: "User loggedIn successfully",
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                googleId: user.googleId,
                facebookID: user.facebookID,
              },
            };
          } else {
            return {
              status: 400,
              message: "UserName and Password Does not Match",
            };
          }
        } else {
          // For Genreating Random OTP
          important_OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          console.log(important_OTP);

          // FOR Sending Message
          const twilio = require("twilio")(
            process.env.ACCOUNT_SID,
            process.env.AUTH_TOKEN
          );
          await twilio.messages
            .create({
              from: "+12342659887",
              to: `+${userData.phoneNumber}`,
              body: `Your One Time Password is ${important_OTP} This will expire in 5 mins`,
            })
            .then((message) => {
              // console.log("DATA is", message);
              return {
                status: 200,
                msg: "OTP Send Successfully",
                json: { message: message.body },
              };
            })
            .catch((err) => {
              console.log("Unable to Send The OTP", err);
            });
        }
      } else {
        return {
          status: 400,
          message: "UserName Does not Exists in the Database",
        };
      }
    }
  },
  changePassword: async (data, req, res) => {
    const userData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      id: data.id,
    };

    console.log(userData);

    const user = await Service.userService.findUserById(userData);
    if (user) {
      const passwordMatch = bcrypt.compare(oldPassword, user.password);
      if (passwordMatch) {
        const value = data.newPassword;
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(value, salt);

        const user = await Service.userService.changePassword(
          hashPassword,
          userData
        );
        return {
          status: 200,
          message: "Password Update Successfully",
        };
      }
    } else {
      return {
        status: 400,
        message: "User Does not Exists in the Database",
      };
    }
  },
  countuserByPhoneNumber: async (data) => {
    const user = await Service.userService.countuserByPhoneNumber(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        messge: "NO DATA FOUND",
      };
    }
  },
  countuserByEmail: async (data) => {
    const user = await Service.userService.countuserByEmail(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  list: async (datas,req,res) => {
    let data={
      id:req.params.id
    }
    const user = await Service.userService.findUserById(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  getUserBygoogleId: async (data) => {
    const user = await Service.userService.getUserBygoogleId(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  getUserByFacebookId: async (data) => {
    const user = await Service.userService.getUserByFacebookId(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },
  deleteUser: async (data) => {
    const datas = {
      id: data.id,
    };
    let users = await Service.userService.get(datas);
    if (users) {
      let user = await Service.userService.deleteUser(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      user: user,
    };
  },
   editUser: async (datas, req, res) => {
    const schema = Joi.object({
      name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
      phoneNumber:Joi.number().integer().required(),
    });
    let payload = await Helper.verifyjoiSchema(datas, schema);
    if (!payload) {
      return { status: 400, message: "Invalid strings types" };
    }
    else{
      let data = { 
        id:req.params.id,
       name: payload.name,
      phoneNumber:payload.phoneNumber  
     };
       let update = await Service.userService.updateData(data);
       if(update){
         return { status:200 , message: "data updated successfully",update:update };
       }
      else {
       return { status: 201 ,message: "Something is wrong" }; 
     }
    }

  }, 
   block: async (d) => {
    let data = {
      id: d.id, 
    };
    let user = await Service.userService.get(data);
    if (user.Isblocked===0) {
      let user = await Service.userService.blockperson(data);
      return {
        status: 200,
        message: "Sucessfull block the user",
      };
    }
    else{
      let user = await Service.userService.Unblockperson(data);
      return {
        status: 201,
        message: "Sucessfull Unblock the user",
      };
    }

   
  },
};
