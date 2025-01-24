const express = require('express');
const router = express.Router();

const Dish = require("../models/dish.model");

router.get("/", async (req, res) => {
    try {
      const dishes = await Dish.find().populate('counter');
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req,res) =>{
    try {
        const dish = new Dish(req.body);
        await dish.save();
        res.status(201).json(dish);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    
})


router.get("/:id", async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.id).populate('counter');
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


router.patch("/:id", async (req, res) => {
    try {
      const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if(!dish){
        return res.status(404).json({error: "Dish not found"});
      }

      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      const dish = await Dish.findByIdAndDelete(req.params.id);
      if (!dish) return res.status(404).json({ error: "Dish not found" });
      res.json({ message: "Dish deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
module.exports = router;



  