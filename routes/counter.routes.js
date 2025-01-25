
const express = require('express');
const router = express.Router();

const Counter = require("../models/counter.model");
const Dish = require("../models/dish.model")

// Get all counters with populated merchant field
router.get("/", async (req, res) => {
    try {
        const counters = await Counter.find()
        res.json({counters: counters});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new counter
// router.post("/", async (req, res) => {
//     try {
//         // const { name, merchants } = req.body;

//         // for (merchant of merchants) {
//         //     const merchantExists = await User.findById(merchant);
//         //     if (!merchantExists) {
//         //         return res.status(400).json({ error: `Merchant with ID ${merchant} does not exist` });
//         //     }
//         // }
        
//         const counter = new Counter(req.body);
//         await counter.save();
//         res.status(201).json({counter: counter});
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });



router.post("/", async (req, res) => {
    try {
        console.log(req.url);
      const counter = new Counter(req.body);
      await counter.save();
      res.status(201).json(counter);
    } catch (error) {
      res.status(400).json({ error: error.message});
   }
});
// Get a single counter by ID with populated merchant field
router.get("/:id", async (req, res) => {
    try {
        const counter = await Counter.findById(req.params.id).populate('merchants');
        if (!counter) {
            return res.status(404).json({ message: "Counter not found" });
        }
        res.json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a counter by ID
router.patch("/:id", async (req, res) => {
    try {
        const counter = await Counter.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('merchants');
        if (!counter) {
            return res.status(404).json({ error: "Counter not found" });
        }
        res.json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a counter by ID
router.delete("/:id", async (req, res) => {
    try {
        const counter = await Counter.findByIdAndDelete(req.params.id);
        if (!counter) {
            return res.status(404).json({ error: "Counter not found" });
        }
        res.json({ message: "Counter deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
