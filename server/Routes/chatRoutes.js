const express = require("express");
const {protect} = require("../middlewares/authMIddleware");
const {accessChat,fetchChat,createGroupChat,renameGroup,removeGroup,addGruop} =require("../controllers/chatController");
const router = express.Router();

router.post("/",protect,accessChat);
router.get("/",protect,fetchChat);
router.post("/group",protect,createGroupChat);
router.put("/rename",protect,renameGroup);
router.put("/remove",protect,removeGroup);
router.put("/addGroup",protect,addGruop);

module.exports = router; 
