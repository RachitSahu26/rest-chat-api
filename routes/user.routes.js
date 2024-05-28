const express = require("express")
const router = express.Router();
const protectRoute =require("../middleware/protectRoute")
const otherUserController = require("../controllers/user.controller");

router.get("/otherUser",protectRoute,otherUserController);
module.exports = router;