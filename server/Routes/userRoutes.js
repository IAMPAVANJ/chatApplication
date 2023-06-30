const express = require('express')
const router = express.Router();
const {protect} = require("../middlewares/authMIddleware")
const {registerUser,login,allUsers} = require("../controllers/userController")

router.post("/register",registerUser)
router.post("/login",login)
router.get("/alluser",protect,allUsers)

module.exports = router