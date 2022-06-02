const { verify } = require("jsonwebtoken");
const userModel = require("../models/user");
const blogModel = require("../models/blog");

require("dotenv").config();
const userAccess = ["/add", "/list", "/forgot", "/verify"];
const blogaccessuser = ["/updateblog", "/getbyidblog", "/deleteblog"];
async function checkUserOrAdmin(req, res, next) {
  try {
    const token = req.header("Authorization");
    const data = verify(token, process.env.secratekey);

    const result = await userModel.findById(data.id);
    if (result != undefined) {
      req.id = data.id;
      if (result.isstatus == true) {
        if (data.role === "admin") {
          next();
        } else {
          if (req.url == "/new" || req.url == "/bloglist") {
            next();
          } else if (blogaccessuser.indexOf(req.path) !== -1) {
            const checkblog = await blogModel.find({ createdby: req.id });

            if (checkblog.length == 0) {
              res.json({ message: "You have not rights change this blog" });
            } else {
              next();
            }
          } else {
            res.json({ message: "you have provide access for this api" });
          }
        }
      } else {
        res.json({ message: "Yor not active member" });
      }
    } else {
      res.json({ message: " your not a exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  verifytoken: async (req, res, next) => {
    if (userAccess.indexOf(req.path) != -1) {
      // user

      next();
    } else {
      // blog and admin
      checkUserOrAdmin(req, res, next);
    }
  },
};
