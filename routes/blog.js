const express = require("express");
const blogcontroller = require("../controllers/blogController");
const blogRouter = express.Router();
blogRouter.post("/new", blogcontroller.newBlog);
blogRouter.post("/updateblog", blogcontroller.updateblogbyid);
blogRouter.get("/bloglist", blogcontroller.getAllBlog);
blogRouter.get("/getbyidblog", blogcontroller.getBlogById);
blogRouter.delete("/deleteblog", blogcontroller.deleteBlogById);
module.exports = blogRouter;
