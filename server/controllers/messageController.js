const asyncHandler = require("express-async-handler");
const Message =require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const sendMessage = asyncHandler(async(req,res)=>{
    const {content,chatId} = req.body;
    if(!content || !chatId){
        console.log("Invalid data passed Into it");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    };

    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender","name pic"); 
        message = await message.populate('chat');
        message = await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        });
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        });
        res.json(message);

    }catch(err){
        res.status(400)
        console.log(err)
        throw new Error("Error Occured while messages")
    }   


})

const allMessages = asyncHandler(async(req,res)=>{
    try{
        const message = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat");
        res.json(message);
    }catch(err){
        res.status(400);
        throw new Error(err.message);
    }
});
 
module.exports = {sendMessage,allMessages}