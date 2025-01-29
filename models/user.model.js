const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    dish : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
        validate : {
            validator : async (dishId)=>{
                const dish = await mongoose.model('Dish').exists({_id: dishId});
                if(!dish){
                    return false;
                }
                return true;
            },
            message : 'Dish not found'
        }
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    }
})

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    }, 
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["customer", "admin", "merchant"],
        required: true,
    },
    cart: {
        type: [cartSchema],
        default: [],
    }
})


module.exports = mongoose.model("User", userSchema, "users");