const { registerController,loginUser, logout } = require('../controllers/auth.controllers');
const express = require("express");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginUser);

router.route("/logout").get(logout);
module.exports = router;