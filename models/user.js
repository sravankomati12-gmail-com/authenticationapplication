const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  asRole: { type: String, default: "user" },
  createdat: { type: Date, default: Date.now() },
  isstatus: { type: Boolean, default: false },
});

module.exports = mongoose.model("users", userModel);
