const express = require("express");
const router = express.Router();
const User = require("../models/user.model");


router.get("/", async (req, res) =>{
    try{
        const users = await User.find().select("username email role");
        res.json({users: users});

    }catch(err){
        res.status(500).json({message: err.message});
    }
})


// router.post("/", async (req, res) => {
//     const users = req.body.users; // Expecting an array of users in the request body
//     try {
//         await User.insertMany(users);
//         res.status(201).json({ message: "Users created successfully" });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });


router.post("/", async (req, res) =>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })
    try{
       await newUser.save();
        res.status(201).json({message: `User created successfully`, user: newUser});
    }catch(err){
        res.status(400).json({message: err.message});
    }
})


router.get("/:id", async (req, res) =>{
    try{
        const id = req.params.id;
        console.log(id);
        const user = await User.findById(id);
        if(!user){
           res.status(404).json({message: `User not found`});
        }

        res.json({user: user});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.patch("/:id", async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json({message: `User not found`});
        }
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.role = req.body.role;
        await user.save();
        res.json({message: `User updated successfully`});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
router.patch("/:id/role", async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json({message: `User not found`});
        }
        user.role = req.body.role;
        await user.save();
        res.json({message: `User updated successfully` , user: user});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.delete("/:id", async (req, res) =>{
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({message: `User not found`});
        }
        res.json({message: `User deleted successfully`, user: user} );
    }catch(err){
        res.status(500).json({message: err.message});
    }
})


module.exports = router;