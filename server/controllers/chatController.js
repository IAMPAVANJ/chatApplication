const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");


//To access the chat from all the users
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("userId Paramas Not available")
        return res.status(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ],
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })
    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
                'users', '-password'
            );
            res.status(200).send(fullChat)
        } catch (err) {
            res.status(400);
            throw new Error(err.message)
        }
    }
})

//To fetch the data from chat done by users


const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async(result)=>{
                result = await User.populate(result,{
                    path:'latestMessage.sender',
                    select:"name pic email"
                });
                res.status(200).send(result)
            })
    } catch (err) {
        res.status(400)
        throw new Error(err.message);
    }
})

//To create a new group

const createGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
         return res.status(400).send({message:"Please fill all The fields"})
    }

    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("More than 2 users are required to create a group")
    } 
    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate('groupAdmin',"-password")

        res.status(200).send(fullGroupChat)
    }catch(err){
         res.status(400)
         throw new Error(err);
    }

})

//To rename the Group title

const renameGroup = asyncHandler(async(req,res)=>{
    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,{chatName:chatName},{new:true})
    .populate('users',"-password")
    .populate("groupAdmin","-password")

    if(!updatedChat){
        res.status(400)
        throw new Error("Chat Not Found")
    }else{
        res.json(updatedChat);
    }
})

//add the user in the group

const addGruop = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}        
    },{new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password')

    if(!added){
        res.status(400)
        throw new Error("chat Not found")
    }else{
        res.json(added)
    }

})

// To remove the user from Group

const removeGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true})
    .populate('users',"-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("Chat not found")
    }else{
        res.json(removed)
    }
})

module.exports = { accessChat, fetchChat,createGroupChat,renameGroup,removeGroup,addGruop}