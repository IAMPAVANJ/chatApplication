const express = require("express");
const app  =express();
const color = require('colors')
const userRoutes = require("./Routes/userRoutes")
const dotenv = require('dotenv');
const cors = require("cors")
const { notFound,errorHandler } = require("./middlewares/errorMiddlware");
const connect = require("./database/db");
app.use(cors())
dotenv.config()
const port = process.env.PORT || 5000;
connect()

app.use(express.json())
app.use(express.urlencoded({extended:false}))


//api's
app.use("/api/user",userRoutes)
app.use(notFound)
app.use(errorHandler)




app.listen(port,()=>{console.log(`server is up at ${port}`.blue.bgMagenta)})
