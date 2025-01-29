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

app.use(express.json());
app.use(cors());
// app.use(authToken);
async function auth(req,res,next){
    const {email} = req.userInfo;
    req.user = await User.findOne({email: email}).select("username email role cart");
    console.log(req.user);
    next();
}


app.use("/", authRouter);
app.use("/user",authToken, auth, userRouter);
app.use("/dish", authToken, auth, dishRouter);
app.use("/counter", authToken, auth, counterRouter);
app.use("/cart",authToken, auth, cartRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})