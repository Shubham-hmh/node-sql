const express =require("express");
const cors=require("cors");
const dotenv=require("dotenv").config();
const app =express();
const Port=5000;
const {db} =require("./config/db");
const authRouter =require("./routes/authRoute")
var cookies = require("cookie-parser");

app.use(express.json());
app.use(cors());
app.use(cookies())






db.getConnection( (err, connection)=> {
  if (err) throw (err)
  console.log ("DB connected successful: " + connection.threadId)
})

app.use("/api/user",authRouter);

app.listen(Port,()=>{
    console.log(`server is running on Port : ${Port}`)
})