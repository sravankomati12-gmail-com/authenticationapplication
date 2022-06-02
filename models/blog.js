const { Schema, model } = require("mongoose");
const blogModel = new Schema({
  title: String,
  description: String,
  blogimage: String,
  createdby: { type: Schema.Types.ObjectId, ref: "users" },
  createdat: { type: Date, default: Date.now() },
  updateat: { type: Date, default: null },
});
module.exports = model("blogs", blogModel);
