const express = require('express');
const router = express.Router();

const Dish = require("../models/dish.model");
const Counter = require("../models/counter.model");
router.get("/", filterDish, async (req, res) => {
    try {
      res.json(req.dishes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req,res) =>{
    try {
        const dish = new Dish(req.body);
        await dish.save();
        console.log(dish);
        res.status(201).json({dish : dish});
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

      res.json({dish: dish});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ error: "Dish not found" });
    res.json({ message: "Dish deleted successfully", dish: dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  });


  router.get("/counter/:id",filterDish, async (req, res) =>{
      try{
          const id = req.params.id;
          const counterDish = req.dishes.filter(dish => dish.counter._id.toString() == id);
          res.json({counterDish: counterDish});
      }catch(err){
          res.status(500).json({ error: error.message });
      }
  })


  async function filterDish(req, res, next){
    let dishes = await Dish.find().populate('counter');
    dishes = dishes.filter(dish => dish.inStock);
    req.dishes = dishes;
    next();
  }

  
module.exports = router;



  