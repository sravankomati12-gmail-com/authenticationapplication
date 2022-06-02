const express = require("express");
const userRouter = require("./user");
const blogRouter = require("./blog");
const middleware = require("../middleware/auth");
const usercontroller = require("../controllers/userController");
const router = express.Router();

router.post("/login", usercontroller.loginUser);
router.get("/emailverify/:token", usercontroller.emailverify);
router.post("/verify2", usercontroller.userAuthentication2);
router.use("/user", middleware.verifytoken, userRouter);
router.use("/blog", middleware.verifytoken, blogRouter);

module.exports = router;
