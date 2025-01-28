const express = require('express');
const router = express.Router();

// const cartController = require('./../controllers/cart.controllers');
const User = require('../models/user.model');

router.use(auth);

router.get('/',async(req,res) => {
    try{
        console.log(req.user);
        const user = await req.user.populate('cart.dish')
        res.json({"cart" : user.cart});

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/',async (req,res) => {
    try{
        req.user.cart.push({dish : req.body.dish , quantity : 1});
        const cart = req.user.cart;
        await req.user.save();

        await req.user.populate('cart.dish')
        res.json({cart : req.user.cart});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.patch('/:id',async (req, res) => {
    try {
        // Use Array.find to locate the cart item by its ID
        console.log(req.url);
        console.log(req.params.id);
        const item = req.user.cart.find(cartItem => cartItem.dish._id.toString() === req.params.id);
        console.log(item);
        if (!item) {
            return res.status(404).json({ message: "Dish not found in the cart" });
        }

        // Update the quantity
        item.quantity += req.body.changeQuantity;

        // Save the updated user document
        await req.user.save();

        await req.user.populate('cart.dish')

        // Return the updated cart
        res.json({ message: "Dish quantity updated successfully", cart: req.user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.delete('/:id',async (req, res) => {
    try {
        // Filter out the dish with the specified ID
        const updatedCart = req.user.cart.filter(cartItem => cartItem.dish._id.toString() !== req.params.id);

        // Check if the dish was found and removed
        if (updatedCart.length === req.user.cart.length) {
            return res.status(404).json({ message: "Dish not found in the cart" });
        }

        // Update the user's cart
        req.user.cart = updatedCart;

        // Save the updated user document
        await req.user.save();

        await req.user.populate('cart.dish')

        // Return the updated cart
        res.json({ message: "Dish deleted successfully", cart: req.user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/',async (req,res) =>{
    try{
        req.user.cart = [];
        await req.user.save();
        res.json({"Cart cleared successfully" : req.user.cart});

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

async function auth(req,res,next){
    const id = "679382c26ff65139eed439d0";
    req.user = await User.findById(id);
    next();
}

module.exports = router;