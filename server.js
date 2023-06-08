const express = require("express");
require("dotenv").config()
const connectDB = require("./config/connectDB")

const app = express();
connectDB();

//test routing
// app.get("/",(req,res)=>{
//     res.send("hello F1")
// })

//middleware
app.use(express.json());
app.use("/api/auth",require("./routes/userRoute"));

const PORT = process.env.PORT || 5001;

app.listen(PORT , (err)=>{
    err? console.log(err)
    : console.log(`server is runing on port ${PORT} `)
})