const asyncHandler = require('express-async-handler')
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require('../config/generateToken');
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All Fields")
    }
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400);
        throw new Error("User Already Exist");
    }
    const user =await User.create( {
        name,
        email,
        password,
        pic
    })

    if(user ){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400).json({
            message:"Error Occucred"
        });
        throw new Error("Something went Wrong User Not Created")
    }

})



const login=asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"email Id Not found kindly put Correct EmailId"
        })
    }
    if(user && (await user.matchPassword(password))){
        return res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        return res.status(400).json({
            message:"Enter Correct password"
        })
    }

})


//api/user

const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ?
    {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ],
    }:{};

    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)

})

module.exports = {registerUser,login,allUsers};