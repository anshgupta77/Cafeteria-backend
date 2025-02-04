const express = require('express');
const router = express.Router();

const Dish = require("../models/dish.model");
const Counter = require("../models/counter.model");
const {ROLE} = require("../contraints")
const {populateCounter} = require("../middleware/counter");
const {authCounter} = require("../middleware/permissions");
router.get("/",filterDish, async (req, res) => {
    try {
      // const dishes = await Dish.find().populate('counter');
      res.json({dishes: req.dishes});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post("/",populateCounter, authCounter, async (req,res) =>{
  const {newDish} = req.body;
    try {
        const dish = new Dish(newDish);
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


router.patch("/:id",populateCounter, authCounter, async (req, res) => {
    const {updatedDish, counterId} = req.body;
    try {
      const dish = await Dish.findByIdAndUpdate(req.params.id, updatedDish, { new: true });
      if(!dish){
        return res.status(404).json({error: "Dish not found"});
      }

      res.json({dish: dish});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id",populateCounter, authCounter, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ error: "Dish not found" });
    res.json({ message: "Dish deleted successfully", dish: dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  });


  router.get("/counter/:id", filterDish, async (req, res) =>{
      try{
          const id = req.params.id;
          const dishes = req.dishes;
          const counterDish =dishes.filter(dish => dish.counter._id.toString() == id);
          res.json({counterDish: counterDish});
      }catch(err){
          res.status(500).json({ error: error.message });
      }
  })


  async function filterDish(req, res, next){
    const role = req.query.role;
    let dishes = await Dish.find().populate('counter');
    if(role !== ROLE.Merchant){
      dishes = dishes.filter(dish => dish.inStock);
    }
    req.dishes = dishes;
    next();
  }

  
module.exports = router;



  