const express = require("express");
const router = express.Router();
const usersController = require("../controller/userController");

router.post("/signup", usersController.userSignUp);

module.exports = router;
