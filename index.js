require("dotenv").config();
const express = require('express');
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {authToken} = require("./middleware/authToken");
const app = express();
const PORT = 3000;
require("./connection");
const userRouter = require("./routes/user.routes");
const dishRouter = require("./routes/dish.routes");
const counterRouter = require("./routes/counter.routes");
const cartRouter = require("./routes/cart.routes");
const authRouter = require("./routes/auth.routes");
const User = require("./models/user.model")
const {isAdmin} = require("./middleware/permissions");

app.use(express.json());
app.use(cors());

app.use("/", authRouter);
app.get("/user/userinfo" ,authToken, async (req, res) =>{
    try{
        console.log(req.url);
        const {email} = req.userInfo;
        // console.log("User info",req.userInfo);
        const user = await User.findOne({email: email});
        res.json({user: user});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})




app.use(authToken);
app.use("/user", auth, isAdmin, userRouter);
app.use("/dish",  auth, dishRouter);
app.use("/counter",  auth, counterRouter);
app.use("/cart", auth, cartRouter);




async function auth(req,res,next){
    const {email} = req.userInfo;
    req.user = await User.findOne({email: email}).select("username email role cart");
    console.log("req.user",req.user);
    next();
}



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})