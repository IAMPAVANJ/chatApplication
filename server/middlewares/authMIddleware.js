const jwt = require("jsonwebtoken");
const User = require("../model/userModel")
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")){
            try{
                token =req.headers.authorization.split(" ")[1]
                // console.log("This is token",token)
                const  decode = jwt.verify(token,"secret");
                req.user = await User.findById(decode.id).select("-password");
                next();

            }catch(err){
                res.status(401)
                throw new Error("Not Authorized, token failed")
            }
        }
        if(!token){
            res.status(401);
            throw new Error("Not authorized, no token")
        }
})

module.exports = {protect};