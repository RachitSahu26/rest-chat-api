const express = require("express");
const messageController = require("../controllers/message.controller");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.post("/send/:id", protectRoute, messageController.chats);
router.get("/:id", protectRoute, messageController.getMessage);

module.exports = router;
