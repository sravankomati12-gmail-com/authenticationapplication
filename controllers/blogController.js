const blogModel = require("../models/blog");
const fs = require("fs");
module.exports = {
  newBlog: async (req, res) => {
    try {
      const { title, description } = req.body;
      const { image } = req.files;
      if (title != "" && description != "" && image != undefined) {
        const imagepath = Date.now() + "_" + image.name;

        const path = "./public/images/" + imagepath;

        image.mv(path, async (err) => {
          if (err) {
            console.log(err);
          } else {
            const path = `http://localhost:5002/${imagepath}`;
            await blogModel.create({
              title,
              description,
              blogimage: path,
              createdby: req.id,
            });
            res.json({ message: "Blog is created", path });
          }
        });
      } else {
        console.log("This fields not empty");
        // res.json({ message: "This fields not empty" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  getAllBlog: async (req, res) => {
    try {
      const getAllBlogs = await blogModel
        .find()
        .populate({ path: "createdby", select: ["name"] });
      res.json({ message: "List of blogs", getAllBlogs });
    } catch (error) {
      // console.log(error.message);
      res.json({ message: error.message });
    }
  },
  getBlogById: async (req, res) => {
    try {
      const { id } = req.query;
      const getBlogById = await blogModel.findById(id);
      if (getBlogById != undefined) {
        res.json({ message: "get blog by id", getBlogById });
      } else {
        res.json({ message: "this blog is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  updateblogbyid: async (req, res) => {
    try {
      const { title, description } = req.body;
      const { id } = req.query;
      const { image } = req.files;
      if (title != "" && description != "" && image != undefined) {
        const getblog = await blogModel.findById(id);

        if (getblog != undefined) {
          const imagepath = Date.now() + "_" + image.name;
          // console.log("image :>> ", image);
          const path = "./public/images/" + imagepath;
          image.mv(path, async (err) => {
            if (err) {
              console.log(err);
            } else {
              const path = `http://localhost:5002/${imagepath}`;
              await blogModel.findByIdAndUpdate(getblog._id, {
                title,
                description,
                blogimage: path,
                createdby: req.id,
              });
              res.json({ message: "Blog is updated" });
            }
          });
        } else {
          res.json({ message: "this blog is not exist" });
        }
      } else {
        res.json({ message: "This fields not empty" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  deleteBlogById: async (req, res) => {
    try {
      const { id } = req.query;
      const getBlogById = await blogModel.findById(id);
      if (getBlogById != undefined) {
        await blogModel.findByIdAndDelete(id);
        res.json({ message: "This blog is deleted" });
      } else {
        res.json({ message: "this blog is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
};
