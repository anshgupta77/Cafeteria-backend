require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;
require("./connection");
const userRouter = require("./routes/user.routes");
const dishRouter = require("./routes/dish.routes");
const counterRouter = require("./routes/counter.routes");
const cartRouter = require("./routes/cart.routes");
const User = require("./models/user.model")
app.use(express.json());
app.use(cors());
app.use(auth);
async function auth(req,res,next){
    const id = "679382c26ff65139eed439d0";
    req.user = await User.findById(id);
    next();
}



app.use("/user",userRouter);
app.use("/dish", dishRouter);
app.use("/counter", counterRouter);
app.use("/cart", cartRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})