const express = require("express");
require("./config/db");
const routes = require("./routes/index");
const fileupload = require("express-fileupload");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(express.static("./public/images"));

app.use("/api", routes);
app.listen(5002, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server is started");
  }
});
