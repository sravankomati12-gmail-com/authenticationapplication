const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sravan_vision:Sravan%40123@cluster0.vr3xu.mongodb.net/admindb?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.on("error", function (error) {
  console.log(error);
});

mongoose.connection.on("open", function () {
  console.log("Connected to MongoDB database.");
});
