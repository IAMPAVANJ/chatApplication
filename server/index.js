const express = require("express");
const app = express();
const color = require('colors')
const userRoutes = require("./Routes/userRoutes")
const dotenv = require('dotenv');
const cors = require("cors");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlware");
const connect = require("./database/db");
app.use(cors())
dotenv.config()
const port = process.env.PORT || 5000;
connect()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//api's
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/dummy",(req,res)=>{
    res.send("Wake Up Server")
})
app.get("/wakeUp",(req,res)=>{
    res.send('wakeup Call to server')
})

app.use(notFound);
app.use(errorHandler);




const server = app.listen(port, () => { console.log(`server is up at ${port}`.blue.bgMagenta) })
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chat-o-chat-by-pavan.vercel.app"
    },
}); 

io.on("connection", (socket) => {
    console.log("Connected to socket.io")
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("user joined room: ",room);
    }) 

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))


    socket.on('new message',(newMessageReceived)=>{
        var chat =  newMessageReceived.chat;
        if(!chat.users) return console.log("chat.user is not defined")

        chat.users.forEach(user=>{
            if(user._id === newMessageReceived.sender._id) return ;
        
            socket.in(user._id).emit("message Received",newMessageReceived);
        });
    });

    socket.off('setup',()=>{
        console.log('User disconnected')
        socket.leave(userData._id);
    })
    
});



