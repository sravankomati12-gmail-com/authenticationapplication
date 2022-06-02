const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const usermodel = require("../models/user");
const authmodel = require("../models/auth2");
const otpmodel = require("../models/otpmodel");
const mail = require("../email");
const bcrypt = require("bcrypt");
require("dotenv").config();
module.exports = {
  adduser: async (req, res) => {
    try {
      const { name, password, email } = req.body;
      const count = 0;
      if (name != "" && email != "" && password != "") {
        const tempsecret = speakeasy.generateSecret();
        const passwordhash = await bcrypt.hash(password, 10);
        const result = await usermodel.create({
          name,
          email,
          password: passwordhash,
        });
        await authmodel.create({ userid: result._id, tempsecret });
        const emailtoken = jwt.sign(
          { useremail: result.email, userid: result._id },
          process.env.secratekey,
          {
            expiresIn: "2h",
          }
        );

        mail.sendlink(email, emailtoken, {
          id: result._id,
          code: tempsecret.base32,
        });
        console.log("token", emailtoken);
        res.json({ message: "Verification link is sended on this email" });
      } else {
        res.json({ message: "This fields not empty" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const getAllUsers = await usermodel.find();
      res.json({ message: "List of users", getAllUsers });
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.query;
      if (id != "") {
        const getUserById = await usermodel.findById(id);

        if (getUserById != null) {
          res.json({ message: "List of users", getUserById });
        } else {
          res.json({ message: "This user is not exist" });
        }
      } else {
        res.json({ message: "id must be required" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  updateUserById: async (req, res) => {
    try {
      const { id, name, password, email } = req.body;
      if (id != "" && name != "" && email != "" && password != "") {
        const getUserById = await usermodel.findById(id);
        if (getUserById != null) {
          await usermodel.findByIdAndUpdate(id, {
            name,
            email,
            password,
          });
          res.json({ message: "This user record is updated" });
        } else {
          res.json({ message: "This user is not exist" });
        }
      } else {
        res.json({ message: "all must be required" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const { id } = req.query;
      if (id != "") {
        const getUserById = await usermodel.findById(id);
        if (getUserById != null) {
          await usermodel.findByIdAndDelete(id);
          res.json({ message: "This user is deleted" });
        } else {
          res.json({ message: "This user is not exist" });
        }
      } else {
        res.json({ message: "id must be required" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email != "" && password != "") {
        const getUserByEmail = await usermodel.findOne({ email });
        // getUserByEmail.password === password
        if (getUserByEmail != null) {
          if (await bcrypt.compare(password, getUserByEmail.password)) {
            const data = {
              id: getUserByEmail._id,
              role: getUserByEmail.asRole,
            };
            const token = jwt.sign(data, process.env.secratekey, {
              expiresIn: "1h",
            });
            res.json({ message: "Your are login", token });
          } else {
            res.json({ message: "This password is not exist" });
          }
        } else {
          res.json({ message: "This email is not exist" });
        }
      } else {
        res.json({ message: "fields  not be empty" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    if (email != "") {
      const otpEmailCheck = await otpmodel.find({ email });

      const otp = Math.floor(1000 + Math.random() * 9000);
      if (otpEmailCheck.length != 0) {
        await otpmodel.findByIdAndUpdate(otpEmailCheck[0]._id, {
          otp,
        });
      } else {
        await otpmodel.create({ email, otp });
      }
      mail.sendMail(email, otp);
      res.json({ message: "Otp is sended succefully" });
    } else {
      res.json({ message: "email is not be empty" });
    }
  },
  otpVerification: async (req, res) => {
    const { otp, newPassword } = req.body;
    const otpCheck = await otpmodel.find({ otp });
    if (otp != "" && newPassword != "") {
      if (otpCheck.length != 0) {
        const password = await bcrypt.hash(newPassword, 10);
        await usermodel.findOneAndUpdate(
          { email: otpCheck[0].email },
          { password: password }
        );
        res.json({ message: "Password is changed" });
      } else {
        res.json({ message: "otp is not matched" });
      }
    } else {
      res.json({ message: "otp and password not be empty" });
    }
  },
  emailverify: async (req, res) => {
    try {
      const { token } = req.params;
      data = jwt.verify(token, process.env.secratekey);

      const userExist = await usermodel.findOne({ _id: data.userid });

      if (userExist != undefined) {
        if (userExist.email == data.useremail) {
          await usermodel.findByIdAndUpdate(
            { _id: userExist._id },
            { isstatus: true }
          );
          res.json({ message: "now your active" });
        } else {
          res.json({ message: "invalid token" });
        }
      } else {
        res.json({ message: "invalid token" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  userAuthentication2: async (req, res) => {
    try {
      const { id, code } = req.body;
      if (id != "" && code != "") {
        const result = await authmodel.findOne({ userid: id });
        const { base32 } = await result.tempsecret;

        const verify = speakeasy.totp.verify({
          secret: base32,
          encoding: "base32",
          token: code,
        });

        if (verify) {
          await usermodel.findByIdAndUpdate(
            { _id: result.userid },
            { isstatus: true }
          );
          res.json({ message: "now your active" });
        } else {
          res.json({ message: "code is not verify" });
        }
      } else {
        res.json({ message: "This id and code not be empty" });
      }
    } catch (error) {
      res.json({ messsage: error.message });
    }
  },
};
