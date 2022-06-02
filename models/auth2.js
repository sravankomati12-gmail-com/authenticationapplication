const mongoose = require("mongoose");
const userAuthentication = new mongoose.Schema({
  userid: String,
  tempsecret: Object,
});
module.exports = mongoose.model("uerAuthentication", userAuthentication);
