const mongoose = require("mongoose")
const color = require('colors')

const connect=async()=>{
    try{
    const conn = await mongoose.connect("mongodb+srv://pavan1010:pavan1010@data1.4qjrld4.mongodb.net/",{
        useNewUrlParser:true,
        useUnifiedTopology:true 
    })
    console.log(`MongoDB Connected:${conn.connection.host}`.yellow.underline)
    }catch(err){
        console.log(`Error:${err.message}`.red.bold);
        process.exit()
    }
}

module.exports = connect;