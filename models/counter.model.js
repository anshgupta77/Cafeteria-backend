const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    merchants :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
})

const Counter = mongoose.model('Counter', counterSchema, "counters");

module.exports = Counter;