const Counter = require("../models/counter.model");
async function populateCounter(req, res, next) {
    const { counterId } = req.body;
    console.log("counterId", counterId);
    try {
        const counter = await Counter.findById(counterId);
        req.counter = counter;
        console.log(req.counter);
    } catch (err) {
        return res.status(404).json({ message: "Counter not found!" });
    }
    next();
}

module.exports = {
    populateCounter
};