const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
userRouter.post("/add", userController.adduser);
userRouter.get("/list", userController.getAllUsers);
userRouter.get("/getbyid", userController.getUserById);
userRouter.delete("/delete", userController.deleteUserById);
userRouter.post("/update", userController.updateUserById);
userRouter.post("/forgot", userController.forgotPassword);
userRouter.get("/verify", userController.otpVerification);

// userRouter.get("/hello", async (req, res) => {
//   try {
//     res.send("Hello Admin");
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = userRouter;
