const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const {validator , registerRules , loginRules} = require("../middleware/validator");
const isAuth = require("../middleware/isAuth");

// register User
router.post("/register",registerRules(), validator, userController.registerUser);
// Login User
router.post("/login",loginRules(),validator, userController.loginUser)

//check Token with middleware isAuth
//get User from req.user  
router.get("/user",isAuth,userController.getUser)

module.exports = router;