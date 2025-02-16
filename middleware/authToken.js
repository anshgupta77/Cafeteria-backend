const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
function authToken(req, res, next){
    // console.log(req.headers);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token_data", token);
    if(!token){
        return res.status(500).json({message: "Not authorise"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data){
        // console.log("token_data", token);
        if(err){
            return res.status(500).json({message: err.message});
        }
        // userinfo.iat
        // console.log("auth_token", token_data);
        req.userInfo = token_data;
        next();
    })
}

async function auth(req,res,next){
    const {email} = req.userInfo;
    req.user = await User.findOne({email: email}).select("username email role cart");
    console.log("req.user",req.user);
    next();
}
module.exports = {
    authToken,
    auth,
}