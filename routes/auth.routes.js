const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/user.model");

router.use(cookieParser());

const sessions = new Set();

router.post("/register", async (req,res) =>{
    console.log(req.url);
    try{
        const {username, password, email, role} = req.body;
        console.log(req.body);

        const ExisitingUser = await User.findOne({email: email});

        if(ExisitingUser){
            return res.status(400).json({message: "User already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = {username: username, password: hash, email: email , role: role};
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({message: "User is created"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
})

router.post("/login", async (req,res) =>{
    console.log(req.url);
    const {email, password} = req.body;
    // console.log(users)
    const user = await User.findOne({email: email});
    if(!user) {
        return res.status(401).json({message: "Incorrect Email"});
    }
    try{
        console.log(password, user);
        const isMatched = await bcrypt.compare(password, user.password);
        console.log(isMatched);
        if(!isMatched){
            return res.status(402).json({message: "Password is incorrect"});
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }

    console.log(user);
    const userInfoForToken = {username: user.username, email: user.email};
    const userInfo = {username: user.username, email: user.email, cart: user.cart, role: user.role};
    const token = generateToken(userInfoForToken)
    const refresh_token = jwt.sign(userInfoForToken,  process.env.REFRESH_TOKEN_SECRET);
    sessions.add(refresh_token);
    res.status(201).json({token: token, refresh_token: refresh_token, user: userInfo});
})

router.post("/token", (req,res) =>{
    console.log(req.url);
    const refresh_token = req.body.token;
    if(!sessions.has(refresh_token)) return res.status(500).json({message: "Not authorise"});

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, function(err, token_data){
        if(err){
            return res.status(500).json({message: "Forbidden", err: err.message});
        }

        // timestamp should be remved so that it will generate new token.
        console.log(token_data);
        const {username, email} = token_data;
        const token = generateToken({username: username, email: email});
        return res.json({ new_access_token : token});
    })
})


router.delete("/logout", (req,res) =>{
    const refresh_token = req.body.token;
    console.log(refresh_token);
    if(!sessions.has(refresh_token)){
        return res.status(404).json({message: "dont try again"})
    }
    sessions.delete(refresh_token);
    res.json({message: "Logout successfully"})
})


function generateToken(data){
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
}



module.exports = router;