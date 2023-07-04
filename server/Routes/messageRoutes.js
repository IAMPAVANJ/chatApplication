const express = require("express");
const { protect } = require("../middlewares/authMIddleware");
const  {sendMessage,allMessages} = require("../controllers/messageController");

const router = express.Router();

router.post("/create",protect,sendMessage)
router.get("/:chatId",protect,allMessages)
module.exports = router;